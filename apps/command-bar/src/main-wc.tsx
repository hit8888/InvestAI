import CommandBar from './App';
import { ENV } from '@meaku/shared/constants/env';
import { BookMeetingContent } from '@meaku/shared/features';
import { injectCSSIntoShadowRoot, setupConnectedCallbackIfShadowRootExists } from './utils/wc';
import { createWc } from './hoc/createWc';

const CommandBarWc = createWc(CommandBar);
const BookMeetingWc = createWc(BookMeetingContent);

setupConnectedCallbackIfShadowRootExists(CommandBarWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

setupConnectedCallbackIfShadowRootExists(BookMeetingWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

customElements.define(ENV.VITE_WC_TAG_NAME, CommandBarWc);
customElements.define(ENV.VITE_BOOK_MEETING_WC_TAG_NAME, BookMeetingWc);

export { CommandBarWc, BookMeetingWc };
