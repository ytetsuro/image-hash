import NTSCCoefMethod from './NTSCCoefMethod';
describe('GlayScaleCalculator', () => {
    describe('NTSCCoefMethod()', () => {
        it('sould equal to NTSCCoef calculated value.', () => {
            const actual = NTSCCoefMethod(255, 60, 100);
            expect(actual).toBe(121);
        });

        it('should return 0 when all channels are 0.', () => {
            const actual = NTSCCoefMethod(0, 0, 0);
            expect(actual).toBe(0);
        });

        it('should return 255 when all channels are 255.', () => {
            const actual = NTSCCoefMethod(255, 255, 255);
            expect(actual).toBe(255);
        });
    });
});