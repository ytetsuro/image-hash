import HexadecimalToHash from "./HexadecimalToHash";

describe('HaxadecimalToHash', () => {
    it('should get Hash.', () => {
        const hexadecimal = '7670795b33135a38';
        const actual = HexadecimalToHash('7670795b33135a38');
        expect(String(actual)).toBe(hexadecimal);
    });

    it('should not get Hash when arguments is not haxadecimal', () => {
        expect(() => {
            HexadecimalToHash('foobar');
        }).toThrowError('Not hexadecimal.');
    })
});