import { ConfigurationApiResponse } from '@meaku/core/types/index';
import { trackError } from '../../../utils/error';

export const getFontElement = (agentConfig: ConfigurationApiResponse | undefined) => {
  const { agent_id, org_name, style_config } = agentConfig ?? {};
  const fontConfig = style_config?.font_config;

  if (!fontConfig) return null;

  const { font_family, font_url } = fontConfig;

  const errorTrackingAdditionalData = {
    org_name,
    agent_id,
    font_family,
    font_url,
  };

  const errorTrackingData = {
    action: 'getFontElement',
    component: 'PreloadContainer',
    additionalData: errorTrackingAdditionalData,
  };

  if (!font_family || !font_url) {
    console.warn('Invalid font configuration:', { font_family, font_url });
    trackError(new Error('Invalid font configuration'), errorTrackingData);
    return null;
  }

  const existingFontLinkElement = document.head.querySelector(`link[href="${font_url}"]`);

  if (existingFontLinkElement) {
    console.log(`Font with url ${font_url} already exists in the document head, skipping`);
    return null;
  }

  const fontLinkElement = document.createElement('link');
  fontLinkElement.href = font_url;
  fontLinkElement.rel = 'stylesheet';
  fontLinkElement.crossOrigin = 'anonymous';
  fontLinkElement.type = 'text/css';

  fontLinkElement.onerror = () => {
    console.error(`Failed to load font from ${font_url}`);
    trackError(new Error('Failed to load font'), errorTrackingData);
  };

  fontLinkElement.onload = () => {
    try {
      document.body.style.fontFamily = `${font_family}, Inter, sans-serif`;
    } catch (error) {
      console.error('Error applying font family:', error);
      trackError(new Error('Error applying font family'), errorTrackingData);
    }
  };

  return fontLinkElement;
};
