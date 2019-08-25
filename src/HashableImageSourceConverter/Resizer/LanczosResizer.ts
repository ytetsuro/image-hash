import { lanczos } from '@rgba-image/lanczos';
import Resizer from './Resizer';

export default class LanczosResizer implements Resizer
{
    public resize(source: Uint8ClampedArray, nativeWidth: number, nativeHeight: number, expectedWidth: number, expectedHeight: number)
    {
        const sourceImageData = <ImageData>(new ImageDataSouce(nativeWidth, nativeHeight, source));
        const destImageData = <ImageData>(new ImageDataSouce(expectedWidth, expectedHeight, new Uint8ClampedArray(expectedWidth * expectedHeight * 4)));

        lanczos(sourceImageData, destImageData);
        return destImageData.data;
    }
}

class ImageDataSouce {
    readonly width: number;
    readonly height: number;
    readonly data: Uint8ClampedArray;
    constructor(width: number, height: number, source: Uint8ClampedArray) {
        this.width = width;
        this.height = height;
        this.data = source;
    }
}