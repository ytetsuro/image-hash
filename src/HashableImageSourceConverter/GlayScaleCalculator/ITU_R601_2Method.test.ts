import ITU_R601_2Method from './ITU_R601_2Method';
describe('GlayScaleCalculator', () => {
    describe('NTSCCoefMethod()', () => {
        it('sould equal to NTSCCoef calculated value.', () => {
            const actual = ITU_R601_2Method(255, 60, 100);
            expect(actual).toBe(123);
        });
    });
});