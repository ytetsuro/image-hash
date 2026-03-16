import HashSource from "./HashSource";

describe('HashSource', () => {
    describe('url', () => {
        it('should accessible url property.', () => {
            const expected = new URL('http://example.com');
            const actual = new HashSource(expected, 1);

            expect(actual.url).toBe(expected);
        });
    });

    describe('hashSize', () => {
        it('should accessible hashSize property.', () => {
            const actual = new HashSource(new URL('http://example.com'), 1);

            expect(actual.hashSize).toBe(1);
        });
    });

    describe('width', () => {
        it('should hashSize + 1 equal to width property.', () => {
            const hashSize = 5;
            const actual = new HashSource(new URL('http://example.com'), hashSize);

            expect(actual.width).toBe(hashSize+1);
        });
    });

    describe('height', () => {
        it('should hashSize equal to height property.', () => {
            const hashSize = 5;
            const actual = new HashSource(new URL('http://example.com'), hashSize);

            expect(actual.height).toBe(hashSize);
        });
    });

    describe('calculateArea()', () => {
        it('should be calculate area.', () => {
            const hashSize = 5;
            const actual = new HashSource(new URL('http://example.com'), hashSize);

            expect(actual.calculateArea()).toBe(30);
        });
    });

    describe('default hashSize', () => {
        it('should use default hashSize of 8 when not specified.', () => {
            const actual = new HashSource(new URL('http://example.com'));

            expect(actual.hashSize).toBe(8);
            expect(actual.width).toBe(9);
            expect(actual.height).toBe(8);
            expect(actual.calculateArea()).toBe(72);
        });
    });
});