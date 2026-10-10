import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test-setup.ts"],
    hookTimeout: 30_000,
    testTimeout: 30_000,
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "./src/core"),
      "@plugins": path.resolve(__dirname, "./src/plugins"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
});
