import HashSource from "./HashSource";
import Hash from "./Hash";

export default class HashGenerator {
    private document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    private generateByImage(source: HashSource, glayImage: HTMLImageElement): Hash
    {
        glayImage.width = source.width;
        glayImage.height = source.height;

        const canvas  = this.document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            throw new ReferenceError('undefined CanvasRenderingContext2D');
        }

        context.drawImage(glayImage, 0, 0, source.width, source.height);

        return this.generate(source, context);
    }

    private generateByCanvasRenderingContext2D(source: HashSource, glayImageDrawingCanvasContext: CanvasRenderingContext2D): Hash
    {
        const imageData = glayImageDrawingCanvasContext.getImageData(0, 0, source.width, source.height).data;
        const glayArray = new Uint8ClampedArray([...Array(imageData.length/4).keys()].map((i) => {
            const index = i * 4;
            return imageData[index];
        }));

        return this.generate(source, glayArray);
    }

    private generateByUint8ClampedArray(source: HashSource, glayArray: Uint8ClampedArray): Hash
    {
        if (glayArray.length !== source.calculateArea()) {
            throw new Error(`Not convertable grayArray, convertable grayArray length is ${source.calculateArea()}`);
        }

        const binaryNumbers = Array.from(glayArray)
            .map((row, index, colors) => ((row <= colors[index+1]) ? 1 : 0))
            .filter((_, index) => (index+1)%source.width !== 0).join('');
        
        return new Hash(binaryNumbers);
    }

    public generate(source: HashSource, glayImageSource: HTMLImageElement|CanvasRenderingContext2D|Uint8ClampedArray): Hash
    {
        if (glayImageSource instanceof HTMLImageElement) {
            return this.generateByImage(source, glayImageSource);
        } else if (glayImageSource instanceof CanvasRenderingContext2D) {
            return this.generateByCanvasRenderingContext2D(source, glayImageSource);
        } else if (glayImageSource instanceof Uint8ClampedArray) {
            return this.generateByUint8ClampedArray(source, glayImageSource);
        }

        throw new TypeError('Not generatable glay image source.');
    }
}