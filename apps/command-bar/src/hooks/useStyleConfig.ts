import { useEffect, useRef } from 'react';
import { hexToHSL } from '@meaku/core/utils/color';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';

interface UseStyleConfigProps {
  styleConfig?: ConfigurationApiResponse['style_config'];
}

export const useStyleConfig = ({ styleConfig }: UseStyleConfigProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

          // Try to inject into shadow root first (web component)
          const shadowRoot = containerRef.current?.getRootNode() as ShadowRoot;
          if (shadowRoot && shadowRoot.host) {
            // We're in a shadow root, inject CSS variables into the shadow root
            (shadowRoot.host as HTMLElement).style.setProperty(`--${formattedKey}`, value);
          } else if (containerRef.current) {
            // Fallback to regular DOM injection
            containerRef.current.style.setProperty(`--${formattedKey}`, value);
          }
        } catch (error) {
          console.error('Error converting hex to HSL:', error);
        }
      });
  }, [styleConfig]);

  return containerRef;
};
