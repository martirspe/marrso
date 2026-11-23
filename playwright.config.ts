import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env['QA_URL'] || 'http://127.0.0.1:4300',
    channel: 'msedge',
    headless: true,
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
  },
});
