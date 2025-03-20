import { hexToRGB } from '@meaku/core/utils/color';
import { ENV } from '@meaku/core/types/env';
import { trackError } from './error';
import { StyleConfig } from '@meaku/core/types/api/session_init_response';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';

export const handleColorConfig = (styleConfig: Omit<StyleConfig, 'banner_config' | 'orb_config'>) => {
  Object.entries(styleConfig)
    .filter(([key]) => !['banner_config', 'function', 'orb_config'].includes(key))
    .forEach(([key, hexValue]) => {
      const formattedKey = key.replace(/_/g, '-');

      if (!hexValue || typeof hexValue !== 'string') return;

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
