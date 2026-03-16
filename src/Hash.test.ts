import Hash from "./Hash";

describe('Hash', () => {
    describe('constructor()', () => {
        it('should not create instance when arguments is not bits.', () => {
            expect(() => {
                new Hash('foobar');
            }).toThrowError('Not bits.');
        });

        it('should create instance when arguments is bits.', () => {
            expect(() => {
                new Hash('01');
            }).not.toThrowError('Not bits.');
        });
    });

    describe('rawHash', () => {
        it('should accessible rawHash property.', () => {
            const expected = new Hash('01');
            expect(expected.rawHash).toBe('01');
        });
    });

    describe('getHammingDistance()', () => {
        it('should get hamming distance by arguments.', () => {
            const hash = new Hash('01');
            const zeroHash = new Hash('01');
            const twoHash = new Hash('10');
            const oneHash = new Hash('11');
            
            expect(hash.getHammingDistance(zeroHash)).toBe(0);
            expect(hash.getHammingDistance(twoHash)).toBe(2);
            expect(hash.getHammingDistance(oneHash)).toBe(1);
        });

        it('should not get hamming distance by arguments when not match length.', () => {
            const hash = new Hash('01');
            const notEqualToLengthHash = new Hash('010');
            const emptyHash = new Hash('');

            expect(() => {
                hash.getHammingDistance(notEqualToLengthHash);
            }).toThrow('Not equal to hash length.');

            expect(() => {
                hash.getHammingDistance(emptyHash);
            }).toThrow('Not equal to hash length.');
        });
    });

    describe('toString()', () => {
        it('should get hexadecimal when cast string.', () => {
            const hash = new Hash('0111011001110000011110010101101100110011000100110101101000111000');

            expect(String(hash)).toBe('7670795b33135a38');
        });

        it('should get empty string when empty hash cast string.', () => {
            const hash = new Hash('');

            expect(String(hash)).toBe('');
        });

        it('should get hexadecimal when bits length is not multiple of 4.', () => {
            const hash = new Hash('101');

            expect(String(hash)).toBe('5');
        });
    });

    describe('getHammingDistance() edge cases', () => {
        it('should return 0 when comparing identical hashes.', () => {
            const hash = new Hash('01010101');
            const same = new Hash('01010101');

            expect(hash.getHammingDistance(same)).toBe(0);
        });

        it('should return full length when all bits differ.', () => {
            const hash = new Hash('0000');
            const opposite = new Hash('1111');

            expect(hash.getHammingDistance(opposite)).toBe(4);
        });
    });
});