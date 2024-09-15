import sharedConfig from "@meaku/tailwind-config";
import uiTwConfig from "@meaku/ui/tailwind-config";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.tsx",
    "./src/*.tsx",
    "./src/components/**/*.tsx",
    "./src/components/*.tsx",
    "./src/pages/*.tsx",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/ui/src/*.{ts,tsx}",
    "../../packages/ui/src/components/**/*.{ts,tsx}",
    "../../packages/ui/src/components/*.{ts,tsx}",
  ],
  presets: [sharedConfig, uiTwConfig],
  plugins: [],
};

export default config;
