import MiddleValue from './MiddleValue';
describe('GlayScaleCalculator', () => {
    describe('MiddleValue()', () => {
        it('sould equal to middle value.', () => {
            const actual = MiddleValue(255, 60, 100);
            expect(actual).toBe(157);
        });
    });
});