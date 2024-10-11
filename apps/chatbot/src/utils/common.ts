import { StyleConfig } from "@meaku/core/types/session";
import { hexToRGB } from "@meaku/core/utils/color";
import { trackError } from "./error";

export const isDev = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

export const handleColorConfig = (styleConfig: StyleConfig) => {
  Object.keys(styleConfig).forEach((key) => {
    const formattedKey = key.replace(/_/g, "-");
    const hexValue = styleConfig[key as keyof typeof styleConfig];

    if (!hexValue) return;

    try {
      const value = hexToRGB(hexValue);
      document.documentElement.style.setProperty(`--${formattedKey}`, value);
    } catch (error) {
      trackError(error, {
        action: "hexToRGB",
        component: "common utils",
      });
    }
  });
};

export const capitalizeString = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getProcessingMessageSequence = (agentName: string = "Sam") => {
  const formattedAgentName = capitalizeString(agentName);

  return [
    `${formattedAgentName} is thinking...`,
    `Hang tight, ${formattedAgentName} is working on it...`,
    "Just a few more seconds...",
    `Almost there, ${formattedAgentName} is getting everything in place...`,
    `${formattedAgentName} is almost done...`,
  ];
};
