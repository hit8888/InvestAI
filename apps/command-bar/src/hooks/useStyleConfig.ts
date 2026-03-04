import { useEffect } from 'react';
import get from 'lodash/get';

import { hexToHSL } from '@neuraltrade/core/utils/color';
import type { ConfigurationApiResponse } from '@neuraltrade/core/types/api/configuration_response';
import { useShadowRoot } from '@neuraltrade/shared/containers/ShadowRootProvider';

interface UseStyleConfigProps {
  styleConfig?: ConfigurationApiResponse['style_config'];
}

const COLOR_CONFIG_KEY_PATHS = [
  { accessorKey: 'primary', cssVariableName: 'primary' },
  { accessorKey: 'secondary', cssVariableName: 'secondary' },
  { accessorKey: 'primary_foreground', cssVariableName: 'primary_foreground' },
  { accessorKey: 'secondary_foreground', cssVariableName: 'secondary_foreground' },
];

// This is for development purposes only, in production shadow root will be the only root
const FALLBACK_ROOT = typeof document !== 'undefined' ? document.documentElement : null;

const useStyleConfig = ({ styleConfig }: UseStyleConfigProps) => {
  const { root: shadowRoot } = useShadowRoot();

  // Handle color configuration
  useEffect(() => {
    if (!styleConfig) return;

    COLOR_CONFIG_KEY_PATHS.forEach(({ accessorKey, cssVariableName }) => {
      const hexValue = get(styleConfig, accessorKey);

      if (!hexValue || typeof hexValue !== 'string') return;

      try {
        const value = hexToHSL(hexValue);
        const rootElement = (shadowRoot?.host as HTMLElement) || FALLBACK_ROOT;

        if (rootElement) {
          rootElement.style.setProperty(`--${cssVariableName}`, value);
        }
      } catch (error) {
        console.error('Error setting style config', error);
      }
    });
  }, [styleConfig, shadowRoot]);

  // Handle font configuration
  useEffect(() => {
    const { font_family: fontFamily, font_url: fontUrl } = styleConfig?.font_config ?? {};
    const rootElement = (shadowRoot?.host as HTMLElement) || FALLBACK_ROOT;

    if (!fontFamily || !fontUrl || !rootElement) return;

    const defaultFontFamily = getComputedStyle(rootElement).getPropertyValue('--font-family').trim();

    rootElement.style.setProperty('--font-family', `${fontFamily}, ${defaultFontFamily}`);

    if (!document.head.querySelector(`link[href="${fontUrl}"]`)) {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }

    return () => {
      rootElement.style.setProperty('--font-family', defaultFontFamily);

      const link = document.head.querySelector(`link[href="${fontUrl}"]`);
      if (link) {
        document.head.removeChild(link);
      }
    };
  }, [styleConfig?.font_config, shadowRoot]);
};

export default useStyleConfig;
