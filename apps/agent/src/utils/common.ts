import { hexToRGB } from '@meaku/core/utils/color';
import { ENV } from '@meaku/core/types/env';
import { trackError } from './error';
import { StyleConfig } from '@meaku/core/types/api/session_init_response';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';
const STYLE_CONFIG_KEYS_NOT_TO_CONSIDER = [
  'banner_config',
  'function',
  'orb_config',
  'entry_point_alignment',
  'entry_point_alignment_mobile',
] as const;

type StyleConfigKeysToOmit = (typeof STYLE_CONFIG_KEYS_NOT_TO_CONSIDER)[number];

export const handleColorConfig = (styleConfig: Omit<StyleConfig, StyleConfigKeysToOmit>) => {
  Object.entries(styleConfig)
    .filter(([key]) => !STYLE_CONFIG_KEYS_NOT_TO_CONSIDER.includes(key as StyleConfigKeysToOmit))
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

export const capitalizeString = (string?: string | null) => {
  if (!string) return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getWebsocketBaseUrl = () => {
  // Ensure WebSocket URL uses wss:// protocol
  const protocol = 'wss:';
  const baseUrl = ENV.VITE_BASE_API_URL.replace(/^https?:/, protocol);
  return baseUrl;
};
