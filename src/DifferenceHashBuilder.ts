import HashableImageSouceConverter from "./HashableImageSourceConverter/HashableImageSourceConverter";
import VanilaConverter from "./HashableImageSourceConverter/DifferenceHash/VanilaConverter";
import HashSource from "./HashSource";
import NTSCCoefMethod from "./HashableImageSourceConverter/GlayScaleCalculator/NTSCCoefMethod";
import LanczosResizer from "./HashableImageSourceConverter/Resizer/LanczosResizer";
import HashGenerator from "./HashGenerator";

export default class DifferenceHashBuilder {
    private generator: HashGenerator;
    private dHashConverter: HashableImageSouceConverter;

    public constructor(dHashConverter: HashableImageSouceConverter|null = null, document: Document = window.document) {
        if (dHashConverter === null) {
            dHashConverter = new VanilaConverter(document, NTSCCoefMethod, new LanczosResizer());
        }

        this.dHashConverter = dHashConverter;
        this.generator = new HashGenerator(document);
    }

    public async generate(url: URL, hashSize: number = 8)
    {
        const source = new HashSource(url, hashSize);
        const hashableImageSouce = await this.dHashConverter.convert(source);

        return this.generator.generate(source, hashableImageSouce);
    }
}