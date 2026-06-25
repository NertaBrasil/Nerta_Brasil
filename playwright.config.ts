import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "fs";

// Carrega credenciais de teste de .env.test.local (gitignored, nunca commitado)
if (existsSync(".env.test.local")) {
  for (const line of readFileSync(".env.test.local", "utf-8").split("\n")) {
    const [key, ...val] = line.split("=");
    if (key?.trim() && !process.env[key.trim()]) {
      process.env[key.trim()] = val.join("=").trim();
    }
  }
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
