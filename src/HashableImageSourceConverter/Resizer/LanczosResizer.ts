import Resizer from './Resizer';

export default class LanczosResizer implements Resizer {
    private readonly fixedFracBits = 14;

    public resize(
        source: Uint8ClampedArray,
        nativeWidth: number, nativeHeight: number,
        expectedWidth: number, expectedHeight: number
    ): Uint8ClampedArray {
        const xRatio = expectedWidth / nativeWidth;
        const yRatio = expectedHeight / nativeHeight;

        const filtersX = this.createFilters(nativeWidth, expectedWidth, xRatio);
        const filtersY = this.createFilters(nativeHeight, expectedHeight, yRatio);

        const tmp = new Uint8ClampedArray(expectedWidth * nativeHeight * 4);
        const dest = new Uint8ClampedArray(expectedWidth * expectedHeight * 4);

        this.convolve(source, tmp, nativeWidth, nativeHeight, expectedWidth, filtersX);
        this.convolve(tmp, dest, nativeHeight, expectedWidth, expectedHeight, filtersY);

        return dest;
    }

    private lanczosKernel(x: number, a: number): number {
        if (x <= -a || x >= a) return 0;
        if (x === 0) return 0;

        const xPi = x * Math.PI;

        return (Math.sin(xPi) / xPi) * Math.sin(xPi / a) / (xPi / a);
    }

    private toFixedPoint(value: number): number {
        return Math.round(value * ((1 << this.fixedFracBits) - 1));
    }

    private createFilters(srcSize: number, destSize: number, scale: number): Int16Array {
        const a = 3;
        const scaleInverted = 1 / scale;
        const scaleClamped = Math.min(1, scale);
        const srcWindow = a / scaleClamped;

        const filterEntries: Array<{ shift: number; data: Int16Array }> = [];
        let totalSize = 0;

        for (let destPixel = 0; destPixel < destSize; destPixel++) {
            const sourcePixel = (destPixel + 0.5) * scaleInverted;
            const sourceFirst = Math.max(0, Math.floor(sourcePixel - srcWindow));
            const sourceLast = Math.min(srcSize - 1, Math.ceil(sourcePixel + srcWindow));

            const filterElementSize = sourceLast - sourceFirst + 1;
            const floatFilter = new Float32Array(filterElementSize);
            const fxpFilter = new Int16Array(filterElementSize);

            let total = 0;
            for (let i = 0; i < filterElementSize; i++) {
                const pixel = sourceFirst + i;
                const floatValue = this.lanczosKernel(((pixel + 0.5) - sourcePixel) * scaleClamped, a);
                total += floatValue;
                floatFilter[i] = floatValue;
            }

            let filterTotal = 0;
            for (let i = 0; i < floatFilter.length; i++) {
                const normalized = floatFilter[i] / total;
                filterTotal += normalized;
                fxpFilter[i] = this.toFixedPoint(normalized);
            }

            const centerIndex = Math.floor(filterElementSize / 2);
            fxpFilter[centerIndex] += this.toFixedPoint(1 - filterTotal);

            let leftNotEmpty = 0;
            while (leftNotEmpty < fxpFilter.length && fxpFilter[leftNotEmpty] === 0) {
                leftNotEmpty++;
            }

            let rightNotEmpty = fxpFilter.length - 1;
            while (rightNotEmpty > 0 && fxpFilter[rightNotEmpty] === 0) {
                rightNotEmpty--;
            }

            const filterShift = sourceFirst + leftNotEmpty;
            const filterSize = rightNotEmpty - leftNotEmpty + 1;
            const trimmed = fxpFilter.subarray(leftNotEmpty, rightNotEmpty + 1);

            const entry = new Int16Array(2 + filterSize);
            entry[0] = filterShift;
            entry[1] = filterSize;
            entry.set(trimmed, 2);

            filterEntries.push({ shift: filterShift, data: entry });
            totalSize += entry.length;
        }

        const packedFilter = new Int16Array(totalSize);
        let ptr = 0;
        for (const entry of filterEntries) {
            packedFilter.set(entry.data, ptr);
            ptr += entry.data.length;
        }

        return packedFilter;
    }

    private convolve(
        source: Uint8ClampedArray, dest: Uint8ClampedArray,
        sw: number, sh: number, dw: number,
        filters: Int16Array
    ): void {
        let srcOffset = 0;
        let destOffset = 0;

        for (let sourceY = 0; sourceY < sh; sourceY++) {
            let filterPtr = 0;

            for (let destX = 0; destX < dw; destX++) {
                const filterShift = filters[filterPtr++];
                let srcPtr = (srcOffset + (filterShift * 4)) | 0;

                let r = 0;
                let g = 0;
                let b = 0;
                let a = 0;

                for (let filterSize = filters[filterPtr++]; filterSize > 0; filterSize--) {
                    const filterValue = filters[filterPtr++];
                    r = (r + filterValue * source[srcPtr]) | 0;
                    g = (g + filterValue * source[srcPtr + 1]) | 0;
                    b = (b + filterValue * source[srcPtr + 2]) | 0;
                    a = (a + filterValue * source[srcPtr + 3]) | 0;
                    srcPtr = (srcPtr + 4) | 0;
                }

                dest[destOffset] = (r + (1 << 13)) >> this.fixedFracBits;
                dest[destOffset + 1] = (g + (1 << 13)) >> this.fixedFracBits;
                dest[destOffset + 2] = (b + (1 << 13)) >> this.fixedFracBits;
                dest[destOffset + 3] = (a + (1 << 13)) >> this.fixedFracBits;

                destOffset = (destOffset + sh * 4) | 0;
            }

            destOffset = ((sourceY + 1) * 4) | 0;
            srcOffset = ((sourceY + 1) * sw * 4) | 0;
        }
    }
}
