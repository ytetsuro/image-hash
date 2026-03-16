import type { WHash } from './types/HashKind';
import HashableImageSouceConverter from './HashableImageSourceConverter/HashableImageSourceConverter';
import VanilaConverter from './HashableImageSourceConverter/DifferenceHash/VanilaConverter';
import LanczosResizer from './HashableImageSourceConverter/Resizer/LanczosResizer';
import ITU_R601_2Method from './HashableImageSourceConverter/GlayScaleCalculator/ITU_R601_2Method';
import WaveletHashGenerator from './WaveletHashGenerator';

export default class WaveletHashBuilder {
    private converter: HashableImageSouceConverter;
    private generator: WaveletHashGenerator;

    public constructor(converter: HashableImageSouceConverter | null = null, document: Document = window.document) {
        if (converter === null) {
            converter = new VanilaConverter(document, ITU_R601_2Method, new LanczosResizer());
        }

        this.converter = converter;
        this.generator = new WaveletHashGenerator();
    }

    public async build(url: URL, hashSize: number = 8, imageScale: number | null = null): Promise<WHash> {
        if (imageScale === null) {
            imageScale = hashSize;
        }

        const source = new WaveletHashSource(url, hashSize, imageScale);
        const grayPixels = await this.converter.convert(source);

        if (!(grayPixels instanceof Uint8ClampedArray)) {
            throw new TypeError('Converter must return Uint8ClampedArray for WaveletHashBuilder.');
        }

        return this.generator.generate(grayPixels, hashSize, imageScale) as WHash;
    }
}

class WaveletHashSource {
    readonly url: URL;
    readonly width: number;
    readonly height: number;
    readonly hashSize: number;

    public constructor(url: URL, hashSize: number, imageScale: number) {
        this.url = url;
        this.hashSize = hashSize;
        this.width = imageScale;
        this.height = imageScale;
    }

    public calculateArea() {
        return this.width * this.height;
    }
}
