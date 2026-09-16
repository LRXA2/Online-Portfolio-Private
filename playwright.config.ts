import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4322/Online-Portfolio-Private/';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.browser.js',
  workers: 1,
  timeout: 60000,
  use: { baseURL, viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4322',
    url: baseURL,
    reuseExistingServer: false,
  },
});
