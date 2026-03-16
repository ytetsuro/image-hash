import { DifferenceHashBuilder } from './index';
import { AverageHashBuilder } from './index';
import { PerceptualHashBuilder } from './index';
import { WaveletHashBuilder } from './index';
import { Hash } from './index';

describe('Browser Hash Integration', () => {
    describe('DifferenceHashBuilder', () => {
        it('should generate dHash from image in browser.', async () => {
            const builder = new DifferenceHashBuilder(null, document);
            const url = new URL('/peppers.png', window.location.origin);
            const result = await builder.build(url, 8);

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('3a7ece1c9df4fcb9');
        });
    });

    describe('AverageHashBuilder', () => {
        it('should generate aHash from image in browser.', async () => {
            const builder = new AverageHashBuilder(null, document);
            const url = new URL('/peppers.png', window.location.origin);
            const result = await builder.build(url, 8);

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('9f172786e71f1e00');
        });
    });

    describe('PerceptualHashBuilder', () => {
        it('should generate pHash from image in browser.', async () => {
            const builder = new PerceptualHashBuilder(null, document);
            const url = new URL('/peppers.png', window.location.origin);
            const result = await builder.build(url, 8);

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('92a71cdc79d980e3');
        });
    });

    describe('WaveletHashBuilder', () => {
        it('should generate wHash from image in browser.', async () => {
            const builder = new WaveletHashBuilder(null, document);
            const url = new URL('/peppers.png', window.location.origin);
            const imageScale = 512;
            const result = await builder.build(url, 8, imageScale);

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('9f1f2786e51f1e00');
        });
    });
});
