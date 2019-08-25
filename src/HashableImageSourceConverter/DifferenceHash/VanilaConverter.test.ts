
import { JSDOM, DOMWindow } from 'jsdom'
import VanilaConverter from './VanilaConverter';
import HashSource from '../../HashSource';
const fs = require('fs');

class DummyImage {
    public onload: () => void = () => {};
    private _src: string = '';

    get src(): string {
        return this._src;
    }

    set src(source: string) {
        setTimeout(this.onload, 100);
        this._src = source;
    }
}

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

    drawImage(img: DummyImage, dx: number, dy: number, width: number, height: number)
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

    setAttribute(name: string, value: string) {

    }
};

describe('VanilaConverter', () => {
    describe('convert()', () => {
        let expectedColorMap: Uint8ClampedArray = new Uint8ClampedArray();
        beforeAll(() => {
            const expectedColorMapSource: string = fs.readFileSync("./fixtures/expectedColorMap.txt", {encoding: "utf-8"});
            expectedColorMap = new Uint8ClampedArray(expectedColorMapSource.toString().split(',').filter(row => row.length > 0).map(row => parseInt(row, 10)));
        });

        it('should get Uint8ClampedArray', async () => {
            const dom = new JSDOM();
            const obj = new VanilaConverter(
                dom.window.document,
                (r: Uint8, g: Uint8, b: Uint8) => r,
                {
                    resize: (source: Uint8ClampedArray, _: number, _2: number, expectedWidth: number, expectedHeight: number) => {
                        return new Uint8ClampedArray(
                            [...Array(expectedWidth * expectedHeight * 4)].map((_, index) => source[index])
                        );
                    }
                }
            );
            (<any>dom.window.document.createElement) = (tagName: string) => {
                return new DummyCanvas(
                    new DummyCanvasRenderingContext2D(
                        new Uint8ClampedArray(expectedColorMap)
                    )
                );
            };
            (<any>global).Image = DummyImage;
            expect(await obj.convert(new HashSource( new URL('http://example.com'), 2))).toEqual(new Uint8ClampedArray([225, 184, 203, 205, 203, 196]));
        });
    });
});