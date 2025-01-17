import { StyleConfig } from '@meaku/core/types/session';
import { hexToRGB } from '@meaku/core/utils/color';
import { ENV } from '@meaku/core/types/env';
import { trackError } from './error';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';

export const handleColorConfig = (styleConfig: Omit<StyleConfig, 'show_banner'>) => {
  Object.entries(styleConfig)
    .filter(([key]) => key !== 'show_banner')
    .forEach(([key, hexValue]) => {
      const formattedKey = key.replace(/_/g, '-');

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
