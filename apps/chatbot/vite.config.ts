import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: Replace the org and project name with the one that is present in org Sentry
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "acme-30",
      project: "javascript-react",
    }),
  ],

  resolve: {
    alias: [
      {
        find: "@meaku/ui",
        replacement: path.resolve(__dirname, "../../packages/ui/src"),
      },
    ],
  },

  build: {
    sourcemap: true,
  },
});
