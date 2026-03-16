import type { PHash } from '../../types/HashKind';
import HashableImageSouceConverter from '../../image/converter/HashableImageSourceConverter';
import VanilaConverter from '../../image/converter/VanilaConverter';
import LanczosResizer from '../../image/resizer/LanczosResizer';
import ITU_R601_2Method from '../../image/grayscale/ITU_R601_2Method';
import PerceptualHashGenerator from './PerceptualHashGenerator';

export default class PerceptualHashBuilder {
    private converter: HashableImageSouceConverter;
    private generator: PerceptualHashGenerator;

    public constructor(converter: HashableImageSouceConverter | null = null, document: Document = window.document) {
        if (converter === null) {
            converter = new VanilaConverter(document, ITU_R601_2Method, new LanczosResizer());
        }

        this.converter = converter;
        this.generator = new PerceptualHashGenerator();
    }

    public async build(url: URL, hashSize: number = 8, highfreqFactor: number = 4): Promise<PHash> {
        const source = new PerceptualHashSource(url, hashSize, highfreqFactor);
        const grayPixels = await this.converter.convert(source);

        if (!(grayPixels instanceof Uint8ClampedArray)) {
            throw new TypeError('Converter must return Uint8ClampedArray for PerceptualHashBuilder.');
        }

        return this.generator.generate(grayPixels, hashSize) as PHash;
    }
}

class PerceptualHashSource {
    readonly url: URL;
    readonly width: number;
    readonly height: number;
    readonly hashSize: number;

    public constructor(url: URL, hashSize: number = 8, highfreqFactor: number = 4) {
        this.url = url;
        this.hashSize = hashSize;
        const imgSize = hashSize * highfreqFactor;
        this.width = imgSize;
        this.height = imgSize;
    }

    public calculateArea() {
        return this.width * this.height;
    }
}