import type { AHash } from '../../types/HashKind';
import HashableImageSouceConverter from '../../image/converter/HashableImageSourceConverter';
import VanilaConverter from '../../image/converter/VanilaConverter';
import HashSource from '../../image/HashSource';
import LanczosResizer from '../../image/resizer/LanczosResizer';
import ITU_R601_2Method from '../../image/grayscale/ITU_R601_2Method';
import AverageHashGenerator from './AverageHashGenerator';

export default class AverageHashBuilder {
    private converter: HashableImageSouceConverter;
    private generator: AverageHashGenerator;

    public constructor(converter: HashableImageSouceConverter | null = null, document: Document = window.document) {
        if (converter === null) {
            converter = new VanilaConverter(document, ITU_R601_2Method, new LanczosResizer());
        }

        this.converter = converter;
        this.generator = new AverageHashGenerator();
    }

    public async build(url: URL, hashSize: number = 8): Promise<AHash> {
        // aHash uses hashSize x hashSize (not hashSize+1 like dHash)
        // Reuse HashSource but override width by using hashSize-1 as input
        // so that width = (hashSize-1)+1 = hashSize... but that changes height too.
        // Instead, create a source with matching dimensions directly.
        const source = new AverageHashSource(url, hashSize);
        const grayPixels = await this.converter.convert(source);

        if (!(grayPixels instanceof Uint8ClampedArray)) {
            throw new TypeError('Converter must return Uint8ClampedArray for AverageHashBuilder.');
        }

        return this.generator.generate(grayPixels, hashSize) as AHash;
    }
}

class AverageHashSource {
    readonly url: URL;
    readonly width: number;
    readonly height: number;
    readonly hashSize: number;

    public constructor(url: URL, hashSize: number = 8) {
        this.url = url;
        this.hashSize = hashSize;
        this.width = hashSize;
        this.height = hashSize;
    }

    public calculateArea() {
        return this.width * this.height;
    }
}