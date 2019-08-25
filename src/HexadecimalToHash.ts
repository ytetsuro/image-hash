import Hash from "./Hash";

export default function HexadecimalToHash(source: string) {
    if (! /^[0-9a-f]+$/i.test(source)) {
        throw new TypeError('Not hexadecimal.');
    }

    const binaryNumber = source.split('').map(row => parseInt(row, 16).toString(2).padStart(4, '0')).join('');

    return new Hash(binaryNumber);
}