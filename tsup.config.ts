import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es5',
  dts: true,
  clean: true,
  outDir: 'dist',
});
