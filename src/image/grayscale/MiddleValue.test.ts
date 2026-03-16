import MiddleValue from './MiddleValue';
describe('GlayScaleCalculator', () => {
    describe('MiddleValue()', () => {
        it('sould equal to middle value.', () => {
            const actual = MiddleValue(255, 60, 100);
            expect(actual).toBe(157);
        });

        it('should return 0 when all channels are 0.', () => {
            const actual = MiddleValue(0, 0, 0);
            expect(actual).toBe(0);
        });

        it('should return 255 when all channels are 255.', () => {
            const actual = MiddleValue(255, 255, 255);
            expect(actual).toBe(255);
        });

        it('should return same value when all channels are equal.', () => {
            const actual = MiddleValue(100, 100, 100);
            expect(actual).toBe(100);
        });
    });
});