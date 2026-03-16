import PerceptualHashBuilder from './PerceptualHashBuilder';
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

describe('PerceptualHashBuilder', () => {
    beforeAll(() => {
        const dom = new JSDOM();
        (<any>global).HTMLImageElement = dom.window.HTMLImageElement;
        (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
    });

    describe('build()', () => {
        it('should return PHash matching python imagehash.', async () => {
            const pixelSource: string = fs.readFileSync('./fixtures/phash_grayscale_32x32.txt', { encoding: 'utf-8' });
            const pixels = new Uint8ClampedArray(
                pixelSource.split(',').map((row: string) => parseInt(row, 10))
            );

            const dom = new JSDOM();
            const builder = new PerceptualHashBuilder(new StubConverter(pixels), dom.window.document);
            const result = await builder.build(new URL('http://example.com'));

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('99c6542d75a3a696');
        });
    });
});