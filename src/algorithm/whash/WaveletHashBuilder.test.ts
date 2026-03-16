import WaveletHashBuilder from './WaveletHashBuilder';
import HashableImageSouceConverter from '../../image/converter/HashableImageSourceConverter';
import Hash from '../../Hash';
import { JSDOM } from 'jsdom';
const fs = require('fs');

class StubConverter implements HashableImageSouceConverter {
    private result: Uint8ClampedArray;
    constructor(result: Uint8ClampedArray) {
        this.result = result;
    }

    convert(): Promise<Uint8ClampedArray> {
        return Promise.resolve(this.result);
    }
}

class DummyCanvasRenderingContext2D {}

describe('WaveletHashBuilder', () => {
    beforeAll(() => {
        const dom = new JSDOM();
        (<any>global).HTMLImageElement = dom.window.HTMLImageElement;
        (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
    });

    describe('build()', () => {
        it('should return WHash matching python imagehash for 8x8 image.', async () => {
            const pixelSource: string = fs.readFileSync('./fixtures/whash_grayscale.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map((row: string) => parseInt(row, 10))
            );
            const imageScale = Math.sqrt(pixels.length);

            const dom = new JSDOM();
            const builder = new WaveletHashBuilder(new StubConverter(pixels), dom.window.document);
            const result = await builder.build(new URL('http://example.com'), 8, imageScale);

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('b69c3d890b0b8f8e');
        });
    });
});