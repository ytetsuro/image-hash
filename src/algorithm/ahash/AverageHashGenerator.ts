import Hash from '../../Hash';

export default class AverageHashGenerator {
    public generate(grayPixels: Uint8ClampedArray, hashSize: number): Hash {
        const expectedLength = hashSize * hashSize;
        if (grayPixels.length !== expectedLength) {
            throw new Error(
                `Invalid pixel array length: expected ${expectedLength}, got ${grayPixels.length}`
            );
        }

        const pixels = Array.from(grayPixels);
        const mean = pixels.reduce((sum, val) => sum + val, 0) / pixels.length;
        const bits = pixels.map(pixel => pixel > mean ? '1' : '0').join('');

        return new Hash(bits);
    }
}