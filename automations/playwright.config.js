import { defineConfig, devices } from '@playwright/test';

const TIMEOUTS = {
  teste: 120_000,
  expect: 10_000,
  acao: 15_000,
  navegacao: 30_000,
};

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: 2,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  timeout: TIMEOUTS.teste,
  expect: {
    timeout: TIMEOUTS.expect,
  },

  use: {
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
    actionTimeout: TIMEOUTS.acao,
    navigationTimeout: TIMEOUTS.navegacao,
  },

  projects: [
    {
      name: 'chrome',
      testMatch: /.*frontend\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:3000',
      },
    },
    {
      name: 'e2e',
      testMatch: /.*e2e\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:3000',
      },
    },
    {
      name: 'rest',
      testMatch: /.*api\/.*\.spec\.js/,
      use: {
        baseURL: 'http://127.0.0.1:8080',
      },
    },
  ],
});
