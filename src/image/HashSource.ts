export default class HashSource {
    readonly url: URL;
    readonly width: number;
    readonly height: number;
    readonly hashSize: number;

    public constructor(url: URL, hashSize: number = 8) {
        this.url = url;
        this.hashSize = hashSize;
        this.width = hashSize + 1;
        this.height = hashSize;
    }

    public calculateArea() {
        return this.width * this.height;
    }
}