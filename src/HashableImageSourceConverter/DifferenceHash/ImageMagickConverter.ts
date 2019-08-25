import { call } from 'wasm-imagemagick';
import HashableImageSouceConverter from '../HashableImageSourceConverter';
import HashSource from '../../HashSource';

export default class ImageMagickConverter implements HashableImageSouceConverter {

    private document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    private extractExtension(url: URL): string
    {
        if (url.protocol === 'data:') {
            const mimeType = url.pathname.split(';').shift() || '';
            switch (mimeType.toLowerCase()) {
                case 'image/png':
                    return 'png';
                case 'image/gif':
                    return 'gif';
                case 'image/jpeg':
                    return 'jpeg';
                default:
                    throw new TypeError('Not supported mimetype.');
            }
        }

        const fileName = decodeURIComponent(url.pathname.split('/').pop() || '');

        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
    }

    private async createImageFileSource(url: URL)
    {
        const extension = this.extractExtension(url);
        const fileName = `source.${extension}`;
        const fetchedSourceImage = await fetch(url.toString())
        const content = new Uint8Array(await fetchedSourceImage.arrayBuffer());

        return { name: fileName, content };
    }

    private async convertImage(source: HashSource)
    {
        const imageFileSource = await this.createImageFileSource(source.url);

        const command = [
            'convert',
            imageFileSource.name,
            '-filter', 'Lanczos', '-resize', `${source.width}x${source.height}!`, // resize command.
            '-colorspace', 'Gray', '-define', 'png:color-type=0', // glayScale command.
            'output.png'
        ];

        return call([imageFileSource], command);
    }

    convert(source: HashSource): Promise<HTMLImageElement>
    {
        return new Promise<HTMLImageElement>(async (resolve, reject) => {
            const convertResult = await this.convertImage(source);
            
            if(convertResult.exitCode !== 0) {
                reject('There was an error: ' + convertResult.stderr.join('\n'));
            }

            const img = this.document.createElement('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                resolve(img);
            }
            img.onerror = reject;

            img.src = URL.createObjectURL(new Blob([convertResult.outputFiles[0].buffer || new ArrayBuffer(0)]));
        });
    }
}