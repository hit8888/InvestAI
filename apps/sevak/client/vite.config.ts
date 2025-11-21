import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if running in standalone app mode (has index.html) or library mode
const isAppMode = existsSync(path.resolve(__dirname, "index.html"));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Only generate .d.ts files in library mode
    !isAppMode &&
      dts({
        insertTypesEntry: true,
        include: ["src/**/*"],
        exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/main.tsx"],
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Library mode build config (only when building library)
  ...(isAppMode
    ? {}
    : {
        build: {
          lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "SevakClient",
            formats: ["es"],
            fileName: () => `index.js`,
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            },
          },
          sourcemap: true,
          minify: false, // Keep readable for debugging when imported
        },
      }),
  server: {
    port: 3002,
  },
});
