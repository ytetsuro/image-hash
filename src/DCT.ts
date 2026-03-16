// scipy.fftpack.dct type 2 compatible implementation
// Not using Web Audio API because it does not provide raw DCT access
export function dct1d(input: number[]): number[] {
    const N = input.length;
    return Array.from({ length: N }, (_, k) => {
        let sum = 0;
        for (let n = 0; n < N; n++) {
            sum += input[n] * Math.cos(Math.PI * k * (2 * n + 1) / (2 * N));
        }
        return sum * 2;
    });
}

export function dct2d(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const rowTransformed = matrix.map(row => dct1d(row));

    const result: number[][] = Array.from({ length: rows }, () => new Array(cols));
    for (let j = 0; j < cols; j++) {
        const column = rowTransformed.map(row => row[j]);
        const transformed = dct1d(column);
        for (let i = 0; i < rows; i++) {
            result[i][j] = transformed[i];
        }
    }

    return result;
}
