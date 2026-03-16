import type Hash from '../Hash';

declare const HashKind: unique symbol;

export type DHash = Hash & { readonly [HashKind]: 'dhash' };
export type AHash = Hash & { readonly [HashKind]: 'ahash' };
export type PHash = Hash & { readonly [HashKind]: 'phash' };
export type WHash = Hash & { readonly [HashKind]: 'whash' };
