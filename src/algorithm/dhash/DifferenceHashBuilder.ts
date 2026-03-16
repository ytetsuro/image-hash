import HashableImageSouceConverter from "../../image/converter/HashableImageSourceConverter";
import VanilaConverter from "../../image/converter/VanilaConverter";
import HashSource from "../../image/HashSource";
import LanczosResizer from "../../image/resizer/LanczosResizer";
import DifferenceHashGenerator from "./DifferenceHashGenerator";
import ITU_R601_2Method from "../../image/grayscale/ITU_R601_2Method";

export default class DifferenceHashBuilder {
    private generator: DifferenceHashGenerator;
    private dHashConverter: HashableImageSouceConverter;

    public constructor(dHashConverter: HashableImageSouceConverter|null = null, document: Document = window.document) {
        if (dHashConverter === null) {
            dHashConverter = new VanilaConverter(document, ITU_R601_2Method, new LanczosResizer());
        }

        this.dHashConverter = dHashConverter;
        this.generator = new DifferenceHashGenerator(document);
    }

    public async build(url: URL, hashSize: number = 8)
    {
        const source = new HashSource(url, hashSize);
        const hashableImageSouce = await this.dHashConverter.convert(source);

        return this.generator.generate(source, hashableImageSouce);
    }
}