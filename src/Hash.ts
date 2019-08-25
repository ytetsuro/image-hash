export default class Hash
{
    readonly rawHash: string;

    public constructor(rawHash: string) {
        if (rawHash.split('').find(row => (row !== '1' && row !== '0'))) {
            throw new TypeError('Not bits.');
        }

        this.rawHash = rawHash;
    }

    public getHammingDistance(hash: Hash)
    {
        if (this.rawHash.length !== hash.rawHash.length) {
            throw new TypeError('Not equal to hash length.');
        }

        const target = hash.rawHash.split('');
        const diff = this.rawHash.split('').filter((row, index) => row !== (target[index] || '0'));

        return diff.length;
    }

    public toString() {
        return this.calcuateHexadecimal(this.rawHash.split('').map(row => (row === '1') ? 1 : 0 ));
    }

    private arrayChunk(array: (0|1)[], chunk: number) {
        return [...Array(Math.ceil(array.length / chunk)).keys()].
            map(index => array.slice(index * chunk, (index * chunk) + chunk))
    }

    private calcuateHexadecimal(binalyNumbers: (0|1)[])
    {
        return this.arrayChunk(binalyNumbers, 4)
            .map(row => parseInt(row.join(''), 2).toString(16)).join('');
    }
}