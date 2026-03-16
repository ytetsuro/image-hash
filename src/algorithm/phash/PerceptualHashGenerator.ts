import Hash from '../../Hash';
import { dct2d } from '../../image/transform/DCT';

export default class PerceptualHashGenerator {
    private highfreqFactor: number;

    public constructor(highfreqFactor: number = 4) {
        this.highfreqFactor = highfreqFactor;
    }

    public generate(grayPixels: Uint8ClampedArray, hashSize: number): Hash {
        const imgSize = hashSize * this.highfreqFactor;
        const expectedLength = imgSize * imgSize;
        if (grayPixels.length !== expectedLength) {
            throw new Error(
                `Invalid pixel array length: expected ${expectedLength}, got ${grayPixels.length}`
            );
        }

        const matrix = this.toMatrix(Array.from(grayPixels), imgSize);
        const dct = dct2d(matrix);
        const lowFreq = this.extractLowFrequencies(dct, hashSize);
        const median = this.calculateMedian(lowFreq);
        const bits = lowFreq.map(val => val > median ? '1' : '0').join('');

        return new Hash(bits);
    }

    private toMatrix(pixels: number[], size: number): number[][] {
        return Array.from({ length: size }, (_, i) =>
            pixels.slice(i * size, (i + 1) * size)
        );
    }

    private extractLowFrequencies(dct: number[][], hashSize: number): number[] {
        const result: number[] = [];
        for (let i = 0; i < hashSize; i++) {
            for (let j = 0; j < hashSize; j++) {
                result.push(dct[i][j]);
            }
        }
        return result;
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