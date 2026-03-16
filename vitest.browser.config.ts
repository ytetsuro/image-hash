import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  publicDir: '/workspaces/image-hash/fixtures',
  server: {
    host: '0.0.0.0',
  },
  test: {
    globals: true,
    root: './src',
    include: ['**/*.browser.test.ts'],
    testTimeout: 30000,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
});
