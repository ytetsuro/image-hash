# Browser image hash

This is browser image hash generator.
This library is made to generate the same hash as [image-hash](https://github.com/JohannesBuchner/imagehash) as much as possible.

## Supported.

* difference hashing ([dHash](http://www.hackerfactor.com/blog/index.php?/archives/529-Kind-of-Like-That.html))

## Feature Suuport.

* average hashing ([aHash](http://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html))
* perception hashing ([pHash](http://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html))
* wavelet hashing ([wHash](https://fullstackml.com/2016/07/02/wavelet-image-hash-in-python/))

## Basic Using

```typescript
import {DifferenceHashBuilder, Hash} from 'browser-image-hash';

document.addEventListener('DOMContentLoaded', async () => {
  const builder = new DifferenceHashBuilder();
  const destHash = await builder.build(new URL('./example.jpg', window.location.href));
  const srcHash = new Hash('0111011001110000011110010101101100110011000100110101101000111000');

  if (srcHash.getHammingDistance(destHash) <= 10) {
     console.log('Resembles');
     return;
  }

  console.log('Different');
});
```

⚠️ Since this library uses canvas, please be careful of the same origin policy.[Allowing cross-origin use of images and canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
