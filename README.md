[![Build Status](https://travis-ci.org/ytetsuro/image-hash.svg?branch=master)](https://travis-ci.org/ytetsuro/image-hash)
[![codecov](https://codecov.io/gh/ytetsuro/image-hash/branch/master/graph/badge.svg)](https://codecov.io/gh/ytetsuro/image-hash)

# Browser image hash

This is browser image hash generator.

This library is made to generate the same hash as [image-hash](https://github.com/JohannesBuchner/imagehash) as much as possible.

## Supported

* difference hashing ([dHash](http://www.hackerfactor.com/blog/index.php?/archives/529-Kind-of-Like-That.html))
* average hashing ([aHash](http://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html))
* perception hashing ([pHash](http://www.hackerfactor.com/blog/index.php?/archives/432-Looks-Like-It.html))
* wavelet hashing ([wHash](https://fullstackml.com/2016/07/02/wavelet-image-hash-in-python/))

## Installation

```bash
$ npm install browser-image-hash
```

## Basic Usage

```typescript
import {DifferenceHashBuilder, Hash} from 'browser-image-hash';

document.addEventListener('DOMContentLoaded', async () => {
  const builder = new DifferenceHashBuilder();
  const targetURL = new URL('./example.jpg', window.location.href);
  const destHash = await builder.build(targetURL);
  const srcHash = new Hash('0111011001110000011110010101101100110011000100110101101000111000');

  if (srcHash.getHammingDistance(destHash) <= 10) {
     console.log('Resembles');
     return;
  }

  console.log('Different');
});
```

## Other Hash Algorithms

```typescript
import {
  AverageHashBuilder,
  PerceptualHashBuilder,
  WaveletHashBuilder,
} from 'browser-image-hash';

const url = new URL('./example.jpg', window.location.href);

// Average Hash
const aHash = await new AverageHashBuilder().build(url);

// Perceptual Hash
const pHash = await new PerceptualHashBuilder().build(url);

// Wavelet Hash
const wHash = await new WaveletHashBuilder().build(url);
```

## Type-safe Hash Comparison

Each builder returns a branded hash type (`DHash`, `AHash`, `PHash`, `WHash`). `getHammingDistance` only accepts the same hash type at compile time.

```typescript
import type { DHash, AHash } from 'browser-image-hash';

const d1: DHash = await new DifferenceHashBuilder().build(url1);
const d2: DHash = await new DifferenceHashBuilder().build(url2);
const a1: AHash = await new AverageHashBuilder().build(url1);

d1.getHammingDistance(d2); // OK
d1.getHammingDistance(a1); // Compile error
```

## Warning

Since this library uses canvas, please be careful of the same origin policy.

[Allowing cross-origin use of images and canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
