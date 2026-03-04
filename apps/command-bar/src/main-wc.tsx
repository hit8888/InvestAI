import { lazy } from 'react';

import CommandBar from './App';
import { ENV } from '@neuraltrade/shared/constants/env';
import { injectCSSIntoShadowRoot, setupConnectedCallbackIfShadowRootExists } from './utils/wc';
import { createWc } from './hoc/createWc';
import './utils/sentry.ts';

const AskAiContent = lazy(() => import('@neuraltrade/shared/features/ask-ai/AskAiContent'));
const BookMeetingContent = lazy(() => import('@neuraltrade/shared/features/book-meeting/BookMeetingContent'));
const SummarizeContent = lazy(() => import('@neuraltrade/shared/features/summarize/SummarizeContent'));
const VideoLibraryContent = lazy(() => import('@neuraltrade/shared/features/video-library/VideoLibraryContent'));
const DemoLibraryContent = lazy(() => import('@neuraltrade/shared/features/demo-library/DemoLibraryContent'));

const CommandBarWc = createWc(CommandBar, ENV.VITE_WC_TAG_NAME);
const BookMeetingWc = createWc(BookMeetingContent, ENV.VITE_BOOK_MEETING_WC_TAG_NAME);
const AskAiWc = createWc(AskAiContent, 'breakout-ask-ai');
const SummarizeWc = createWc(SummarizeContent, 'breakout-summarize');
const VideoLibraryWc = createWc(VideoLibraryContent, 'breakout-video-library');
const DemoLibraryWc = createWc(DemoLibraryContent, 'breakout-demo-library');

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

setupConnectedCallbackIfShadowRootExists(DemoLibraryWc, (shadowRoot) => {
  injectCSSIntoShadowRoot(shadowRoot);
});

customElements.define(ENV.VITE_WC_TAG_NAME, CommandBarWc);
customElements.define(ENV.VITE_BOOK_MEETING_WC_TAG_NAME, BookMeetingWc);
customElements.define('breakout-ask-ai', AskAiWc);
customElements.define('breakout-summarize', SummarizeWc);
customElements.define('breakout-video-library', VideoLibraryWc);
customElements.define('breakout-demo-library', DemoLibraryWc);
