import CommandBar from './App';
import { ENV } from '@meaku/shared/constants/env';
import { BookMeetingContent, AskAiContent, SummarizeContent, VideoLibraryContent } from '@meaku/shared/features';
import { injectCSSIntoShadowRoot, setupConnectedCallbackIfShadowRootExists } from './utils/wc';
import { createWc } from './hoc/createWc';

const CommandBarWc = createWc(CommandBar, ENV.VITE_WC_TAG_NAME);
const BookMeetingWc = createWc(BookMeetingContent, ENV.VITE_BOOK_MEETING_WC_TAG_NAME);
const AskAiWc = createWc(AskAiContent, 'breakout-ask-ai');
const SummarizeWc = createWc(SummarizeContent, 'breakout-summarize');
const VideoLibraryWc = createWc(VideoLibraryContent, 'breakout-video-library');

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

setupConnectedCallbackIfShadowRootExists(VideoLibraryWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

customElements.define(ENV.VITE_WC_TAG_NAME, CommandBarWc);
customElements.define(ENV.VITE_BOOK_MEETING_WC_TAG_NAME, BookMeetingWc);
customElements.define('breakout-ask-ai', AskAiWc);
customElements.define('breakout-summarize', SummarizeWc);
customElements.define('breakout-video-library', VideoLibraryWc);

export { CommandBarWc, BookMeetingWc, SummarizeWc, VideoLibraryWc };
