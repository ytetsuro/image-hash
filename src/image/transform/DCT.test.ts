import { dct2d } from './DCT';
const fs = require('fs');

describe('DCT', () => {
    describe('dct2d()', () => {
        it('should compute 2D DCT matching scipy.fftpack.dct for phash input.', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/phash_grayscale_32x32.txt', { encoding: 'utf-8' });
            const pixels = pixelSource.split(',').map(row => parseFloat(row));

            const expectedSource: string = fs.readFileSync('./fixtures/phash_dct_8x8.txt', { encoding: 'utf-8' });
            const expected = expectedSource.split(',').map(row => parseFloat(row));

            const matrix: number[][] = [];
            for (let i = 0; i < 32; i++) {
                matrix.push(pixels.slice(i * 32, (i + 1) * 32));
            }

            const dctResult = dct2d(matrix);
            const lowFreq: number[] = [];
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    lowFreq.push(dctResult[i][j]);
                }
            }

            lowFreq.forEach((val, index) => {
                expect(val).toBeCloseTo(expected[index], 2);
            });
        });
    });
});