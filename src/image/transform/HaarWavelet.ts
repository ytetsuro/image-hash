// pywt.wavedec2 / pywt.waverec2 compatible Haar wavelet implementation
// Not using external wavelet libraries to keep the bundle size small for browser usage
type Coeffs2D = [number[][], ...Array<[number[][], number[][], number[][]]>];

export function haarWavedec2(matrix: number[][], level: number): Coeffs2D {
    let current = matrix.map(row => [...row]);
    const detailCoeffs: Array<[number[][], number[][], number[][]]> = [];

    for (let l = 0; l < level; l++) {
        const { ll, lh, hl, hh } = haarDecompose2D(current);
        detailCoeffs.unshift([lh, hl, hh]);
        current = ll;
    }

    return [current, ...detailCoeffs];
}

export function haarWaverec2(coeffs: Coeffs2D): number[][] {
    let current = coeffs[0].map(row => [...row]);

    for (let l = 1; l < coeffs.length; l++) {
        const [lh, hl, hh] = coeffs[l] as [number[][], number[][], number[][]];
        current = haarReconstruct2D(current, lh, hl, hh);
    }

    return current;
}

function haarDecompose1D(input: number[]): { low: number[]; high: number[] } {
    const half = input.length / 2;
    const low: number[] = [];
    const high: number[] = [];

    for (let i = 0; i < half; i++) {
        const a = input[2 * i];
        const b = input[2 * i + 1];
        low.push((a + b) / Math.SQRT2);
        high.push((a - b) / Math.SQRT2);
    }

    return { low, high };
}

function haarReconstruct1D(low: number[], high: number[]): number[] {
    const result: number[] = new Array(low.length * 2);

    for (let i = 0; i < low.length; i++) {
        result[2 * i] = (low[i] + high[i]) / Math.SQRT2;
        result[2 * i + 1] = (low[i] - high[i]) / Math.SQRT2;
    }

    return result;
}

function haarDecompose2D(matrix: number[][]): {
    ll: number[][];
    lh: number[][];
    hl: number[][];
    hh: number[][];
} {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const halfRows = rows / 2;
    const halfCols = cols / 2;

    const rowTransformed: { low: number[]; high: number[] }[] = matrix.map(row =>
        haarDecompose1D(row)
    );

    const ll: number[][] = Array.from({ length: halfRows }, () => new Array(halfCols));
    const lh: number[][] = Array.from({ length: halfRows }, () => new Array(halfCols));
    const hl: number[][] = Array.from({ length: halfRows }, () => new Array(halfCols));
    const hh: number[][] = Array.from({ length: halfRows }, () => new Array(halfCols));

    for (let j = 0; j < halfCols; j++) {
        const lowCol = rowTransformed.map(r => r.low[j]);
        const highCol = rowTransformed.map(r => r.high[j]);

        const { low: llCol, high: lhCol } = haarDecompose1D(lowCol);
        const { low: hlCol, high: hhCol } = haarDecompose1D(highCol);

        for (let i = 0; i < halfRows; i++) {
            ll[i][j] = llCol[i];
            lh[i][j] = lhCol[i];
            hl[i][j] = hlCol[i];
            hh[i][j] = hhCol[i];
        }
    }

    return { ll, lh, hl, hh };
}

function haarReconstruct2D(
    ll: number[][],
    lh: number[][],
    hl: number[][],
    hh: number[][]
): number[][] {
    const halfRows = ll.length;
    const halfCols = ll[0].length;
    const rows = halfRows * 2;
    const cols = halfCols * 2;

    const rowLow: number[][] = Array.from({ length: rows }, () => new Array(halfCols));
    const rowHigh: number[][] = Array.from({ length: rows }, () => new Array(halfCols));

    for (let j = 0; j < halfCols; j++) {
        const llCol = ll.map(r => r[j]);
        const lhCol = lh.map(r => r[j]);
        const hlCol = hl.map(r => r[j]);
        const hhCol = hh.map(r => r[j]);

        const lowReconstructed = haarReconstruct1D(llCol, lhCol);
        const highReconstructed = haarReconstruct1D(hlCol, hhCol);

        for (let i = 0; i < rows; i++) {
            rowLow[i][j] = lowReconstructed[i];
            rowHigh[i][j] = highReconstructed[i];
        }
    }

    const result: number[][] = Array.from({ length: rows }, () => new Array(cols));
    for (let i = 0; i < rows; i++) {
        const reconstructed = haarReconstruct1D(rowLow[i], rowHigh[i]);
        for (let j = 0; j < cols; j++) {
            result[i][j] = reconstructed[j];
        }
    }

    return result;
}