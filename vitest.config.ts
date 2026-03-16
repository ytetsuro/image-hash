import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './src',
    exclude: ['**/*.browser.test.ts', '**/node_modules/**'],
  },
});
