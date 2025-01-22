/// <reference types="vitest" />
import { mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";
import { defineConfig as defineViteConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const viteConfig = defineViteConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/types": resolve(__dirname, "./src/types"),
      "@/utils": resolve(__dirname, "./src/utils"),
      "@/constants": resolve(__dirname, "./src/constants"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/queries": resolve(__dirname, "./src/queries"),
      "@/managers": resolve(__dirname, "./src/managers"),
      "@/transformers": resolve(__dirname, "./src/transformers"),
      "@/contexts": resolve(__dirname, "./src/contexts"),
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "src/**/__tests__/*.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],
    passWithNoTests: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],

      exclude: ["node_modules/", "src/test/setup.ts"],
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
