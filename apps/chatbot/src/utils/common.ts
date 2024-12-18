import { StyleConfig } from '@meaku/core/types/session';
import { hexToRGB } from '@meaku/core/utils/color';
import { ENV } from '../config/env';
import { trackError } from './error';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';

export const handleColorConfig = (styleConfig: StyleConfig) => {
  Object.keys(styleConfig).forEach((key) => {
    const formattedKey = key.replace(/_/g, '-');
    const hexValue = styleConfig[key as keyof typeof styleConfig];

    if (!hexValue) return;

    try {
      const value = hexToRGB(hexValue);
      document.documentElement.style.setProperty(`--${formattedKey}`, value);
    } catch (error) {
      trackError(error, {
        action: 'hexToRGB',
        component: 'common utils',
      });
    }
  });
};

export const capitalizeString = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getProcessingMessageSequence = () => {
  return [
    `Thinking...`,
    `Putting together my answer..`,
    `Getting it ready..`,
    `Working on it..`,
    `Forming a complete response..`,
  ];
};
