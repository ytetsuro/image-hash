import WaveletHashGenerator from './WaveletHashGenerator';
const fs = require('fs');

describe('WaveletHashGenerator', () => {
    describe('generate()', () => {
        it('should generate wavelet hash matching python imagehash for glayImage (8x8).', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/whash_grayscale.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map(row => parseInt(row, 10))
            );
            const imageScale = Math.sqrt(pixels.length);

            const generator = new WaveletHashGenerator();
            const actual = generator.generate(pixels, 8, imageScale);

            expect(actual.toString()).toBe('b69c3d890b0b8f8e');
        });

        it('should generate wavelet hash matching python imagehash for peppers (512x512).', () => {
            const pixelSource: string = fs.readFileSync('./fixtures/peppers_whash_grayscale.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map(row => parseInt(row, 10))
            );
            const imageScale = Math.sqrt(pixels.length);

            const generator = new WaveletHashGenerator();
            const actual = generator.generate(pixels, 8, imageScale);

            expect(actual.toString()).toBe('9f1f2786e51f1e00');
        });

        it('should throw when pixel length is not square.', () => {
            const generator = new WaveletHashGenerator();

            expect(() => {
                generator.generate(new Uint8ClampedArray([1, 2, 3]), 8, 8);
            }).toThrow();
        });
    });
});