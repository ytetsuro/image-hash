import AverageHashGenerator from './AverageHashGenerator';
const fs = require('fs');

describe('AverageHashGenerator', () => {
    describe('generate()', () => {
        it('should generate average hash matching python imagehash for glayImage.', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/ahash_grayscale_8x8.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map(row => parseInt(row, 10))
            );

            const generator = new AverageHashGenerator();
            const actual = generator.generate(pixels, 8);

            expect(actual.toString()).toBe('b69c3d890b0b8f8e');
        });

        it('should generate average hash matching python imagehash for peppers.', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/peppers_ahash_grayscale_8x8.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map(row => parseInt(row, 10))
            );

            const generator = new AverageHashGenerator();
            const actual = generator.generate(pixels, 8);

            expect(actual.toString()).toBe('9f172786e71f1e00');
        });

        it('should throw when pixel length does not match hashSize.', () => {
            const generator = new AverageHashGenerator();

            expect(() => {
                generator.generate(new Uint8ClampedArray([1, 2, 3]), 8);
            }).toThrow();
        });
    });
});
