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
    });

    it('should throw TypeError when arguments is empty string.', () => {
        expect(() => {
            HexadecimalToHash('');
        }).toThrowError('Not hexadecimal.');
    });

    it('should get Hash when arguments is uppercase hexadecimal.', () => {
        const actual = HexadecimalToHash('ABCDEF');
        expect(String(actual)).toBe('abcdef');
    });

    it('should get Hash when arguments is single character.', () => {
        const actual = HexadecimalToHash('f');
        expect(String(actual)).toBe('f');
    });
});