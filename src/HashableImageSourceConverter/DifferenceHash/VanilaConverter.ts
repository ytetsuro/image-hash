import HashSource from '../../HashSource';
import HashableImageSouceConverter from '../HashableImageSourceConverter';
import Resizer from '../Resizer/Resizer';

type GlayScaleCalculator = (r: Uint8, g: Uint8, b: Uint8) => Uint8;

export default class VanilaConverter implements HashableImageSouceConverter
{
    private document: Document;
    private glayScaleCalculator: GlayScaleCalculator;
    private resizer: Resizer;

    public constructor(document: Document, glayScaleCalculator: GlayScaleCalculator, resizer: Resizer) {
        this.document = document;
        this.glayScaleCalculator = glayScaleCalculator;
        this.resizer = resizer;
    }

    private createCanvasRenderingContext2D(width: number, height: number): CanvasRenderingContext2D
    {
        const canvas = this.document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        canvas.setAttribute('style', 'image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;');

        const ctx = canvas.getContext('2d');

        if (ctx === null) {
            throw new ReferenceError('undefined CanvasRenderingContext2D');
        }

        (<any>ctx).mozImageSmoothingEnabled = true;
        (<any>ctx).webkitImageSmoothingEnabled = true;
        (<any>ctx).msImageSmoothingEnabled = true;
        ctx.imageSmoothingEnabled = true;

        return ctx;
    }

    public convert(source: HashSource): Promise<Uint8ClampedArray> {
        const img = new Image();
        const result = (new Promise<Uint8ClampedArray>(resolve => {
            img.onload = () => {
                const ctx = this.createCanvasRenderingContext2D(img.width, img.height);
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const colorMap = ctx.getImageData(0, 0, img.width, img.height).data;
                resolve(colorMap);
            };
        }))
        .then(colorMap => {
            return this.resizer.resize(colorMap, img.width, img.height, source.width, source.height)
        }).then(resizedColorMap => {
            const glayArraySouce = [...Array(resizedColorMap.length/4).keys()].map((i) => {
                const index = i * 4;
                const [r, g, b] = [
                    <Uint8>resizedColorMap[index],
                    <Uint8>resizedColorMap[index+1],
                    <Uint8>resizedColorMap[index+2]
                ];
                
                return this.glayScaleCalculator(r, g, b);
            });

            return new Uint8ClampedArray(glayArraySouce);
        });

        img.src = source.url.toString();

        return result;
    }
}