import NTSCCoefMethod from './NTSCCoefMethod';
describe('GlayScaleCalculator', () => {
    describe('NTSCCoefMethod()', () => {
        it('sould equal to NTSCCoef calculated value.', () => {
            const actual = NTSCCoefMethod(255, 60, 100);
            expect(actual).toBe(121);
        });
    });
});