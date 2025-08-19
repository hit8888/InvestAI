import CommandBar from './App';
import { ENV } from '@meaku/shared/constants/env';
import { BookMeetingContent, AskAiContent, SummarizeContent } from '@meaku/shared/features';
import { injectCSSIntoShadowRoot, setupConnectedCallbackIfShadowRootExists } from './utils/wc';
import { createWc } from './hoc/createWc';

const CommandBarWc = createWc(CommandBar);
const BookMeetingWc = createWc(BookMeetingContent);
const AskAiWc = createWc(AskAiContent);
const SummarizeWc = createWc(SummarizeContent);

setupConnectedCallbackIfShadowRootExists(CommandBarWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

setupConnectedCallbackIfShadowRootExists(BookMeetingWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

setupConnectedCallbackIfShadowRootExists(SummarizeWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

setupConnectedCallbackIfShadowRootExists(AskAiWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

customElements.define(ENV.VITE_WC_TAG_NAME, CommandBarWc);
customElements.define(ENV.VITE_BOOK_MEETING_WC_TAG_NAME, BookMeetingWc);
customElements.define('breakout-ask-ai', AskAiWc);
customElements.define('breakout-summarize', SummarizeWc);

export { CommandBarWc, BookMeetingWc, SummarizeWc };
