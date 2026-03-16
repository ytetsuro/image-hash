import { haarWavedec2, haarWaverec2 } from './HaarWavelet';

describe('HaarWavelet', () => {
    describe('haarWavedec2() + haarWaverec2()', () => {
        it('should reconstruct original matrix after decompose and reconstruct.', () => {
            const matrix = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16],
            ];

            const coeffs = haarWavedec2(matrix, 2);
            const reconstructed = haarWaverec2(coeffs);

            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[0].length; j++) {
                    expect(reconstructed[i][j]).toBeCloseTo(matrix[i][j], 10);
                }
            }
        });

        it('should produce correct low-frequency coefficients for 8x8 whash.', () => {
            const pixelSource = require('fs').readFileSync('./fixtures/whash_grayscale.txt', { encoding: 'utf-8' });
            const pixels = (pixelSource as string).split(',').map((row: string) => parseInt(row, 10));
            const size = Math.sqrt(pixels.length);

            const matrix: number[][] = [];
            for (let i = 0; i < size; i++) {
                matrix.push(pixels.slice(i * size, (i + 1) * size).map(v => v / 255));
            }

            const expectedSource = require('fs').readFileSync('./fixtures/whash_dwt_low_8x8.txt', { encoding: 'utf-8' });
            const expected = (expectedSource as string).split(',').map((row: string) => parseFloat(row));

            const llMaxLevel = Math.log2(size);
            const coeffs = haarWavedec2(matrix, llMaxLevel);
            coeffs[0] = coeffs[0].map(row => row.map(() => 0));
            const reconstructed = haarWaverec2(coeffs);

            const dwtLevel = llMaxLevel - Math.log2(8);
            const coeffs2 = haarWavedec2(reconstructed, dwtLevel);
            const dwtLow = coeffs2[0];

            const flatLow = dwtLow.flat();
            flatLow.forEach((val, index) => {
                expect(val).toBeCloseTo(expected[index], 5);
            });
        });
    });
});
