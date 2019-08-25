import {Decimal} from 'decimal.js';
import Resizer from './Resizer';
type DecimalXY = {x: Decimal, y: Decimal};
type NumberXY = {x: number, y:number};

export default class VanilaLanczosResizer implements Resizer
{
    private lobes: 2|3|4 = 3;

    public setLobes(lobes: 2|3|4) {
        this.lobes = lobes;
    }

    public resize(source: Uint8ClampedArray, nativeWidth: number, nativeHeight: number, expectedWidth: number, expectedHeight: number) {
        const result = new Uint8ClampedArray(expectedWidth * expectedHeight * 4);
        const colorMap = this.generateResizedColorMap(
            source,
            {x: nativeWidth, y: nativeHeight},
            {x: expectedWidth, y: expectedHeight}
        );

        
        colorMap.forEach((row) => {
            const [index, red, green, blue, alpha] = row;
            result[index] = red;
            result[index+1] = green;
            result[index+2] = blue;
            result[index+3] = alpha;
        });

        return result;
    }

    private generateResizedColorMap(source: Uint8ClampedArray, native: NumberXY, expected: NumberXY) {
        const lanczos = new Lanczos(native, expected, this.lobes);
        const result = [];

        for (let width = 0; width < expected.x; width++) {
            for (let height = 0; height < expected.y; height++) {
                const [red, green, blue, alpha] = lanczos.calculateRGBA(source, width, height)
                const index = (height * expected.x + width) * 4;
                result.push([index, red, green, blue, alpha]);
            }
        }

        return result;
    }
}

class Lanczos {
    private native: NumberXY;
    private ratio: DecimalXY;
    private rcpRatio: DecimalXY;
    private range2 : NumberXY;
    private lobes: number;
    private cacheLanc: {[key: string]: Decimal} = {};

    public constructor(native: NumberXY, expected: NumberXY, lobes: number) {
        this.native = native;
        this.lobes = lobes;
        this.ratio = {
            x: (new Decimal(native.x)).div(expected.x),
            y: (new Decimal(native.y)).div(expected.y),
        };
        this.rcpRatio = {
            x: (new Decimal(2)).div(this.ratio.x),
            y: (new Decimal(2)).div(this.ratio.y),
        }
        this.range2 = {
            x: Number(this.ratio.x.mul(this.lobes).div(2).ceil().valueOf()),
            y: Number(this.ratio.y.mul(this.lobes).div(2).ceil().valueOf())
        }
    }

    private lanczos(x: Decimal) {
        if (x.gt(this.lobes)) {
            return new Decimal(0);
        }
                
        const pix = x.mul(Math.PI);
        if (pix.abs().lt(1e-16)) {
            return new Decimal(1);
        }
            
        var xx = pix.div(this.lobes);
        return pix.sin().mul(xx.sin()).div(pix).div(xx);
    }

    public calculateRGBA(srcData: Uint8ClampedArray, width: number, height: number)
    {
        const centerPixel: DecimalXY = {
            x: (new Decimal(width)).plus(0.5).mul(this.ratio.x),
            y: (new Decimal(height)).plus(0.5).mul(this.ratio.y)
        };
        const colorCreater = new RGBACreater(srcData);

        this.getIndexes(centerPixel).forEach(row => {
            const fX = centerPixel.x.minus(row[0]).abs().mul(1000);
            const fY = centerPixel.y.minus(row[1]).abs().mul(1000);
            const key = [fX.toString(), fY.toString()].join('/');
            if (!this.cacheLanc[key]) {
                this.cacheLanc[key] = this.lanczos(fX.mul(this.rcpRatio.x).pow(2).plus(fY.mul(this.rcpRatio.y).pow(2)).sqrt().div(1000));
            }

            const index = (row[1] * this.native.x + row[0]) * 4;

            colorCreater.add(index, this.cacheLanc[key]);
        });

        return colorCreater.create();
    }

    private getIndexes(centerPixel: DecimalXY) {
        const iCenterPixel: NumberXY = {
            x: Number(centerPixel.x.floor().valueOf()),
            y: Number(centerPixel.y.floor().valueOf()),
        };
        const result = [];

        for (let i = iCenterPixel.x - this.range2.x; i <= iCenterPixel.x + this.range2.x; i++) {
            if (i < 0 || i >= this.native.x) {
                continue;
            }

            for (let j = iCenterPixel.y - this.range2.y; j <= iCenterPixel.y + this.range2.y; j++) {
                if (j < 0 || j >= this.native.y) {
                    continue;
                }
                result.push([i, j]);
            }
        }

        return result;
    }
}

class RGBACreater {
    private srcData: Uint8ClampedArray;
    private a: Decimal;
    private red: Decimal;
    private blue: Decimal;
    private green: Decimal;
    private alpha: Decimal;

    public constructor(srcData: Uint8ClampedArray) {
        this.srcData = srcData;
        this.a = new Decimal(0);
        this.red = new Decimal(0);
        this.green = new Decimal(0);
        this.blue = new Decimal(0);
        this.alpha = new Decimal(0);
    }

    public add(idx: number, weight: Decimal) {
        if (weight.lte(0)) {
            return;
        }

        this.a = this.a.plus(weight);
        this.red = this.red.plus(weight.mul(this.srcData[idx]));
        this.green = this.green.plus(weight.mul(this.srcData[idx + 1]));
        this.blue = this.blue.plus(weight.mul(this.srcData[idx + 2]));
        this.alpha = this.alpha.plus(weight.mul(this.srcData[idx + 3]));
    }

    public create() {
        return [
            this.red.div(this.a).round().toNumber(),
            this.green.div(this.a).round().toNumber(),
            this.blue.div(this.a).round().toNumber(),
            this.alpha.div(this.a).round().toNumber()
        ];
    }
}