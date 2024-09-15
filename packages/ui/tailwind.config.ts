import sharedConfig from "@meaku/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/components/*.{ts,tsx}",
  ],
  prefix: "ui-",
  presets: [sharedConfig],
};

export default config;
