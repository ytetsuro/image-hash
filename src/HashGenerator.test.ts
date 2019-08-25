import HashGenerator from "./HashGenerator";
import { JSDOM, DOMWindow } from 'jsdom'
import HashSource from "./HashSource";
const fs = require('fs');

type DummyHTMLImageElement = DOMWindow["HTMLImageElement"];

interface DummyImageData {
    readonly data: Uint8ClampedArray;
    readonly width: number;
    readonly height: number;
}

class DummyCanvasRenderingContext2D {
    private dummyData: Uint8ClampedArray;
    constructor(dummyData: Uint8ClampedArray) {
        this.dummyData = dummyData;
    }

    getImageData(dx: number, dy: number, width: number, height: number): DummyImageData
    {
        return <DummyImageData>{
            width,
            height,
            data: this.dummyData,
        }
    }

    drawImage(img: DummyHTMLImageElement, dx: number, dy: number, width: number, height: number)
    {

    }
}

class DummyCanvas {
    private canvasRendering: DummyCanvasRenderingContext2D|null;
    constructor(canvasRendering: DummyCanvasRenderingContext2D|null = null) {
        this.canvasRendering = canvasRendering;
    }

    getContext(type: string) {
        return this.canvasRendering;
    }
};

describe('HashGenerator', () => {
    describe('generate()', () => {
        let expectedColorMap: Uint8ClampedArray = new Uint8ClampedArray();
        beforeAll(() => {
            const expectedColorMapSource: string = fs.readFileSync("./fixtures/expectedColorMap.txt", {encoding: "utf-8"});
            expectedColorMap = new Uint8ClampedArray(expectedColorMapSource.toString().split(',').filter(row => row.length > 0).map(row => parseInt(row, 10)));
        });

        it('should get Hash by Image', () => {
            const dom = new JSDOM();
            const img = dom.window.document.createElement('img');
            (<any>dom.window.document.createElement) = (tagName: string) => {
                return new DummyCanvas(
                    new DummyCanvasRenderingContext2D(
                        new Uint8ClampedArray(expectedColorMap)
                    )
                );
            };

            const obj = new HashGenerator(dom.window.document);
            (<any>global).HTMLImageElement = dom.window.HTMLImageElement;
            (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
            const actual = obj.generate(
                new HashSource(new URL('http://example.com'), 8),
                img 
            );
            
            expect(actual.toString()).toBe('6474695b33331a38');
        });

        it('should get Hash by CanvasRenderingContext2D', () => {
            const dom = new JSDOM();
            const dummy = new DummyCanvasRenderingContext2D(
                new Uint8ClampedArray(expectedColorMap)
            )

            const obj = new HashGenerator(dom.window.document);
            (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
            const actual = obj.generate(
                new HashSource(new URL('http://example.com'), 8),
                <CanvasRenderingContext2D>(<any>dummy) 
            );
            
            expect(actual.toString()).toBe('6474695b33331a38');
        });

        it('should get Hash by Uint8ClampedArray', () => {
            const dom = new JSDOM();
            const obj = new HashGenerator(dom.window.document);

            (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
            const actual = obj.generate(
                new HashSource(new URL('http://example.com'), 2),
                new Uint8ClampedArray([1, 2, 3, 4, 5, 6]) 
            );
            
            expect(actual.toString()).toBe('f');
        });

        it('sould not get Hash by other than Uint8ClampedArray|CanvasRenderingContext2D|HTMLImageElement.', () => {
            const dom = new JSDOM();
            const obj = new HashGenerator(dom.window.document);

            (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;

            expect(() => {
                (<any>obj).generate(new HashSource(new URL('http://example.com'), 8), null);
            }).toThrowError('Not generatable glay image source.');
        });

        it('should not get Hash when not gettable CanvasRenderingContext2D by HTMLImageElement.', () => {
            const dom = new JSDOM();
            const img = dom.window.document.createElement('img');
            (<any>dom.window.document.createElement) = (tagName: string) => {
                return new DummyCanvas();
            };

            const obj = new HashGenerator(dom.window.document);
            (<any>global).HTMLImageElement = dom.window.HTMLImageElement;
            (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;

            expect(() => {
                obj.generate(
                    new HashSource(new URL('http://example.com'), 8),
                    img 
                );
            }).toThrowError('undefined CanvasRenderingContext2D');
        });

        it('should not get Hash by not allowable size Uint8ClampedArray', () => {
            const dom = new JSDOM();
            const obj = new HashGenerator(dom.window.document);

            (<any>global).CanvasRenderingContext2D = DummyCanvasRenderingContext2D;
            
            expect(() => {
                obj.generate(
                    new HashSource(new URL('http://example.com'), 8),
                    new Uint8ClampedArray() 
                );
            }).toThrowError('Not convertable grayArray, convertable grayArray length is 72');
        });
    });
});