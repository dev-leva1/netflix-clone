import { defineConfig, devices } from '@playwright/test'

const isCI = process.env.CI === 'true'
const devPort = 3000
const previewPort = 4173

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: `http://localhost:${isCI ? previewPort : devPort}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: isCI ? `bun run preview -- --port ${previewPort}` : 'bun run dev',
    port: isCI ? previewPort : devPort,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})


