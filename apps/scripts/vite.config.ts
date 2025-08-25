import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

function scriptsPlugin(env: Record<string, string>) {
  return {
    name: "scripts-plugin",
    buildStart() {
      const requiredVars = [
        "VITE_AGENT_BASE_URL",
        "VITE_COMMAND_BAR_BASE_URL",
        "VITE_COMMAND_BAR_TAG_NAME",
      ];
      console.log("\nRequired environment variables:", process.env.NODE_ENV);
      console.table(
        Object.fromEntries(
          requiredVars.map((key) => [key, env[key] || "❌ not set"]),
        ),
      );
    },
    closeBundle() {
      console.log("🎉 Build completed successfully!");
    },
  };
}

const entryPoint = process.env.VITE_ENTRY_POINT || "chat_widget";

const entryPoints = {
  chat_widget: resolve(__dirname, "src/agent/chat_widget.ts"),
  command_bar_widget: resolve(
    __dirname,
    "src/command-bar/command_bar_widget.ts",
  ),
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [scriptsPlugin(env)],

    publicDir: "public",

    build: {
      emptyOutDir: false,
      lib: {
        entry: entryPoints[entryPoint as keyof typeof entryPoints],
        formats: ["iife"],
        fileName: () => `${entryPoint}.js`,
        name: entryPoint,
      },
      target: "es2020",
      sourcemap: true,
      minify: true,
      outDir: "dist",
    },
  };
});
