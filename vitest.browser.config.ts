import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  publicDir: path.resolve(__dirname, 'fixtures'),
  test: {
    globals: true,
    root: './src',
    include: ['**/*.browser.test.ts'],
    testTimeout: 30000,
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          args: ['--no-sandbox'],
        },
      }),
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
});
