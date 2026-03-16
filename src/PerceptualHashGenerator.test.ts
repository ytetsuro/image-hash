import PerceptualHashGenerator from './PerceptualHashGenerator';
const fs = require('fs');

describe('PerceptualHashGenerator', () => {
    describe('generate()', () => {
        it('should generate perceptual hash matching python imagehash for glayImage.', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/phash_grayscale_32x32.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map(row => parseInt(row, 10))
            );

            const generator = new PerceptualHashGenerator();
            const actual = generator.generate(pixels, 8);

            expect(actual.toString()).toBe('99c6542d75a3a696');
        });

        it('should generate perceptual hash matching python imagehash for peppers.', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/peppers_phash_grayscale_32x32.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map(row => parseInt(row, 10))
            );

            const generator = new PerceptualHashGenerator();
            const actual = generator.generate(pixels, 8);

            expect(actual.toString()).toBe('92a71cdc79d980e3');
        });

        it('should throw when pixel length does not match expected size.', () => {
            const generator = new PerceptualHashGenerator();

            expect(() => {
                generator.generate(new Uint8ClampedArray([1, 2, 3]), 8);
            }).toThrow();
        });
    });
});
