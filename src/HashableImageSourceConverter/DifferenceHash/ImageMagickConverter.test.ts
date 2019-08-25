jest.mock('wasm-imagemagick', () => ({
    call: jest.fn(() => {}),
}));
import { call } from 'wasm-imagemagick';
import { JSDOM } from 'jsdom';
import ImageMagickConverter from './ImageMagickConverter';
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

let dummyFetch = jest.fn();

describe('ImageMagickConverter', () => {
    describe('convert()', () => {
        beforeEach(() => {             
            (<any>call).mockClear();
            dummyFetch.mockClear();                               
        })

        it('should get HTMLImageElement.', async () => {
            const dom = new JSDOM();
            (<any>call).mockImplementation(() => Promise.resolve({
                exitCode: 0,
                outputFiles: [fs.readFileSync('./fixtures/glayImage.png')]
            }));
            dummyFetch.mockImplementation(() => Promise.resolve({
                arrayBuffer: () => {
                    const buffer = fs.readFileSync('./fixtures/glayImage.png');
                    let result = new ArrayBuffer(buffer.length);
                    let view = new Uint8Array(result);
                    for (var i = 0; i < buffer.length; ++i) {
                        view[i] = buffer[i];
                    }

                    return Promise.resolve(result);
                }
            }));
            (<any>dom.window.document).createElement = () => {
                return new DummyImage();
            };
            (<any>global).fetch = dummyFetch;
            (<any>global).URL.createObjectURL = jest.fn(() => 'blob:http://example.com/hoge');
            (<any>global).URL.revokeObjectURL = jest.fn();

            const converter = new ImageMagickConverter(dom.window.document);
            const actual = await converter.convert(new HashSource(new URL('http://exmaple.com/foo.png'), 2));

            expect(actual.src).toBe('blob:http://example.com/hoge');
            expect(dummyFetch.mock.calls[0][0]).toBe('http://exmaple.com/foo.png');
            expect((<any>call).mock.calls[0][1]).toEqual(['convert',
                'source.png',
                '-filter', 'Lanczos', '-resize', `3x2!`,
                '-colorspace', 'Gray', '-define', 'png:color-type=0',
                'output.png'
            ]);
        });

        it('should parse extension in dataURL.', async () => {
            const dom = new JSDOM();
            (<any>call).mockImplementation(() => Promise.resolve({
                exitCode: 0,
                outputFiles: [fs.readFileSync('./fixtures/glayImage.png')]
            }));
            dummyFetch.mockImplementation(() => Promise.resolve({
                arrayBuffer: () => {
                    const buffer = fs.readFileSync('./fixtures/glayImage.png');
                    let result = new ArrayBuffer(buffer.length);
                    let view = new Uint8Array(result);
                    for (var i = 0; i < buffer.length; ++i) {
                        view[i] = buffer[i];
                    }

                    return Promise.resolve(result);
                }
            }));
            (<any>dom.window.document).createElement = () => {
                return new DummyImage();
            };
            (<any>global).fetch = dummyFetch;
            (<any>global).URL.createObjectURL = jest.fn(() => 'blob:http://example.com/hoge');
            (<any>global).URL.revokeObjectURL = jest.fn();

            const converter = new ImageMagickConverter(dom.window.document);
            await converter.convert(new HashSource(new URL('data:image/png;base64,iVBOR'), 2));
            await converter.convert(new HashSource(new URL('data:image/jpeg;base64,iVBOR'), 2));
            await converter.convert(new HashSource(new URL('data:image/gif;base64,iVBOR'), 2));
            expect((<any>call).mock.calls[0][1]).toEqual(['convert',
                'source.png',
                '-filter', 'Lanczos', '-resize', `3x2!`,
                '-colorspace', 'Gray', '-define', 'png:color-type=0',
                'output.png'
            ]);
            expect((<any>call).mock.calls[1][1]).toEqual(['convert',
                'source.jpeg',
                '-filter', 'Lanczos', '-resize', `3x2!`,
                '-colorspace', 'Gray', '-define', 'png:color-type=0',
                'output.png'
            ]);
            expect((<any>call).mock.calls[2][1]).toEqual(['convert',
                'source.gif',
                '-filter', 'Lanczos', '-resize', `3x2!`,
                '-colorspace', 'Gray', '-define', 'png:color-type=0',
                'output.png'
            ]);
        });
    });
});