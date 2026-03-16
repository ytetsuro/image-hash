import ITU_R601_2Method from './ITU_R601_2Method';
describe('GlayScaleCalculator', () => {
    describe('ITU_R601_2Method()', () => {
        it('sould equal to ITU_R601_2 calculated value.', () => {
            const actual = ITU_R601_2Method(255, 60, 100);
            expect(actual).toBe(123);
        });

        it('should return 0 when all channels are 0.', () => {
            const actual = ITU_R601_2Method(0, 0, 0);
            expect(actual).toBe(0);
        });

        it('should return 255 when all channels are 255.', () => {
            const actual = ITU_R601_2Method(255, 255, 255);
            expect(actual).toBe(255);
        });
    });
});