import Hash from './Hash';
import { haarWavedec2, haarWaverec2 } from './HaarWavelet';

export default class WaveletHashGenerator {
    public generate(grayPixels: Uint8ClampedArray, hashSize: number, imageScale: number): Hash {
        const expectedLength = imageScale * imageScale;
        if (grayPixels.length !== expectedLength) {
            throw new Error(
                `Invalid pixel array length: expected ${expectedLength}, got ${grayPixels.length}`
            );
        }

        const normalized = Array.from(grayPixels).map(v => v / 255);
        const matrix = this.toMatrix(normalized, imageScale);

        const llMaxLevel = Math.log2(imageScale);
        const level = Math.log2(hashSize);
        const dwtLevel = llMaxLevel - level;

        const withoutDC = this.removeMaxHaarLL(matrix, llMaxLevel);
        const coeffs = haarWavedec2(withoutDC, dwtLevel);
        const dwtLow = coeffs[0];

        const flatLow = dwtLow.flat();
        const median = this.calculateMedian(flatLow);
        const bits = flatLow.map(val => val > median ? '1' : '0').join('');

        return new Hash(bits);
    }

    private removeMaxHaarLL(matrix: number[][], llMaxLevel: number): number[][] {
        const coeffs = haarWavedec2(matrix, llMaxLevel);
        coeffs[0] = coeffs[0].map(row => row.map(() => 0));
        return haarWaverec2(coeffs);
    }

    private toMatrix(pixels: number[], size: number): number[][] {
        return Array.from({ length: size }, (_, i) =>
            pixels.slice(i * size, (i + 1) * size)
        );
    }

    private calculateMedian(values: number[]): number {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        }
        return sorted[mid];
    }
}
