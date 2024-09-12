import sharedConfig from "@meaku/tailwind-config";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
  plugins: [],
};

export default config;
