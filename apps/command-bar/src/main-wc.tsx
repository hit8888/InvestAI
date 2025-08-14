import r2wc from '@r2wc/react-to-web-component';

import App from './App';
import type { SettingsContainerProps } from './containers/SettingsContainer';
import RootContainer from './containers/RootContainer';
import { ENV } from '@meaku/shared/constants/env';

function injectCSSIntoShadowRoot(shadowRoot: ShadowRoot) {
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
}

const AppWrapper = (props: SettingsContainerProps) => {
  return (
    <RootContainer settings={props}>
      <App />
    </RootContainer>
  );
};

const CommandBar = r2wc(AppWrapper, {
  props: {
    agentId: 'string',
    tenantId: 'string',
    visible: 'boolean',
    message: 'string',
    startTime: 'string',
    endTime: 'string',
    sessionId: 'string',
    browsedUrls: 'string',
    bc: 'boolean',
  },
  shadow: 'open',
});

const originalConnectedCallback = CommandBar.prototype.connectedCallback;
CommandBar.prototype.connectedCallback = function () {
  if (originalConnectedCallback) {
    originalConnectedCallback.call(this);
  }
  if (this.shadowRoot) {
    injectCSSIntoShadowRoot(this.shadowRoot);
  }
};

customElements.define(ENV.VITE_WC_TAG_NAME, CommandBar);

export default CommandBar;
