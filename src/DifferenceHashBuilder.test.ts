import DifferenceHashBuilder from "./DifferenceHashBuilder";
import HashableImageSourceConverter from "./HashableImageSourceConverter/HashableImageSourceConverter";
import HashSource from "./HashSource";
import Hash from "./Hash";
import { JSDOM } from 'jsdom';

class DummyCanvasRenderingContext2D {}

class StubConverter implements HashableImageSourceConverter {
    private result: Uint8ClampedArray;
    constructor(result: Uint8ClampedArray) {
        this.result = result;
    }

    convert(source: HashSource): Promise<Uint8ClampedArray> {
        return Promise.resolve(this.result);
    }
}

describe('DifferenceHashBuilder', () => {
    beforeAll(() => {
        const dom = new JSDOM();
        (<any>global).HTMLImageElement = dom.window.HTMLImageElement;
        (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
    });

    describe('build()', () => {
        it('should return Hash from converted image source.', async () => {
            const stubConverter = new StubConverter(
                new Uint8ClampedArray([1, 2, 3, 4, 5, 6])
            );
            const dom = new JSDOM();
            const builder = new DifferenceHashBuilder(stubConverter, dom.window.document);

            const result = await builder.build(new URL('http://example.com'), 2);

            expect(result).toBeInstanceOf(Hash);
            expect(result.toString()).toBe('f');
        });

        it('should use default hashSize of 8 when not specified.', async () => {
            const pixelData = new Uint8ClampedArray(72);
            for (let i = 0; i < 72; i++) {
                pixelData[i] = i;
            }
            const stubConverter = new StubConverter(pixelData);
            const dom = new JSDOM();
            const builder = new DifferenceHashBuilder(stubConverter, dom.window.document);

            const result = await builder.build(new URL('http://example.com'));

            expect(result).toBeInstanceOf(Hash);
        });
    });
});
