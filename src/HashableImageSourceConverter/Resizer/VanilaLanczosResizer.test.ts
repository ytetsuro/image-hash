import VanilaLanczosResizer from "./VanilaLanczosResizer";
const fs = require('fs');

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

describe('LanczosResizer', () => {
  describe('resize()', () => {
    let actual: Uint8ClampedArray = new Uint8ClampedArray();
    let imageColorMap: number[];
    let expectedColorMap: number[];

    beforeAll(() => {
      const imageColorMapSource = fs.readFileSync("./fixtures/imageColorMap.txt", {encoding: "utf-8"});
      const expectedColorMapSource = fs.readFileSync("./fixtures/expectedColorMap.txt", {encoding: "utf-8"});
      const resizer = new VanilaLanczosResizer();
      imageColorMap = (<string>imageColorMapSource).toString().split(',').filter(row => row.length > 0).map(row => parseInt(row, 10));
      expectedColorMap = (<string>expectedColorMapSource).toString().split(',').filter(row => row.length > 0).map(row => parseInt(row, 10));
      actual = resizer.resize(
        new Uint8ClampedArray(imageColorMap),
        256, 256,
        9, 8
      );
    });

    it('should equal to resized length', () => {
      expect(actual.length).toBe(9 * 8 * 4);
    });

    it.skip('should be within 1 difference for calculation result.', async () => {
        expectedColorMap.forEach((row, index) => {
            (<any>expect(actual[index])).toBeWithinRange(row - 1, row + 1);
        });
    });
  })
})