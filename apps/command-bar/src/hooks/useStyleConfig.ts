import { useEffect } from 'react';

import { hexToHSL } from '@meaku/core/utils/color';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import { useShadowRoot } from '@meaku/shared/containers/ShadowRootProvider';

interface UseStyleConfigProps {
  styleConfig?: ConfigurationApiResponse['style_config'];
}

const useStyleConfig = ({ styleConfig }: UseStyleConfigProps) => {
  const { root: shadowRoot, fallbackRoot } = useShadowRoot();

  useEffect(() => {
    if (!styleConfig) return;

    const STYLE_CONFIG_KEYS_NOT_TO_CONSIDER = [
      'banner_config',
      'function',
      'orb_config',
      'entry_point_alignment',
      'entry_point_alignment_mobile',
      'invert_text_color',
      'shadow_enabled',
      'font_config',
    ] as const;

    Object.entries(styleConfig)
      .filter(
        ([key]) =>
          !STYLE_CONFIG_KEYS_NOT_TO_CONSIDER.includes(key as (typeof STYLE_CONFIG_KEYS_NOT_TO_CONSIDER)[number]),
      )
      .forEach(([key, hexValue]) => {
        const formattedKey = key.replace(/_/g, '-');

        if (!hexValue || typeof hexValue !== 'string') return;

        try {
          const value = hexToHSL(hexValue);
          const shadowRootElement = shadowRoot?.host as HTMLElement;

          if (shadowRootElement) {
            shadowRootElement.style.setProperty(`--${formattedKey}`, value);
            return;
          }
          fallbackRoot?.style.setProperty(`--${formattedKey}`, value);
        } catch (error) {
          console.error('Error setting style config', error);
        }
      });
  }, [styleConfig, shadowRoot, fallbackRoot]);
};

export default useStyleConfig;
