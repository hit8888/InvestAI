import { ENV } from '@neuraltrade/shared/constants/env';
import type r2wc from '@r2wc/react-to-web-component';

export const injectCSSIntoShadowRoot = (shadowRoot: ShadowRoot) => {
  // Get base URL from the script's location
  const scripts = document.getElementsByTagName('script');
  let baseUrl = '';

  // Find our script
  for (const script of scripts) {
    const src = script.src;
    if (src && src.includes(`${ENV.VITE_WC_TAG_NAME}.js`)) {
      baseUrl = src.substring(0, src.lastIndexOf('/') + 1);
      break;
    }
  }

  // Fallback to current script if not found
  if (!baseUrl && document.currentScript) {
    const src = (document.currentScript as HTMLScriptElement).src;
    baseUrl = src.substring(0, src.lastIndexOf('/') + 1);
  }

  // Create and inject the CSS link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = baseUrl ? `${baseUrl}${ENV.VITE_WC_TAG_NAME}.css` : `./${ENV.VITE_WC_TAG_NAME}.css`;
  shadowRoot.appendChild(link);
};

export const setupConnectedCallbackIfShadowRootExists = (
  CustomElement: ReturnType<typeof r2wc>,
  onConnected?: (shadowRoot: ShadowRoot) => void,
) => {
  const originalConnectedCallback = CustomElement.prototype.connectedCallback;
  CustomElement.prototype.connectedCallback = function () {
    if (originalConnectedCallback) {
      originalConnectedCallback.call(this);
    }
    if (this.shadowRoot) {
      onConnected?.(this.shadowRoot);
    }
  };
};
