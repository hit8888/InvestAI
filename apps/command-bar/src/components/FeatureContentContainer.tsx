import { lazy } from 'react';
import type { CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';
import { FeatureContentWrapper } from './FeatureContentWrapper';
import { useCommandBarStore } from '@neuraltrade/shared/stores';
import useOutsideClick from '../hooks/useOutsideClick';
import { withSuspenseWrapper } from '@neuraltrade/core/containers/SuspenseWrapper';

const AskAiContent = lazy(() => import('@neuraltrade/shared/features/ask-ai/AskAiContent'));
const BookMeetingContent = lazy(() => import('@neuraltrade/shared/features/book-meeting/BookMeetingContent'));
const SummarizeContent = lazy(() => import('@neuraltrade/shared/features/summarize/SummarizeContent'));
const IframeContent = lazy(() => import('@neuraltrade/shared/features/iframe/IframeContent'));
const VideoLibraryContent = lazy(() => import('@neuraltrade/shared/features/video-library/VideoLibraryContent'));
const DemoLibraryContent = lazy(() => import('@neuraltrade/shared/features/demo-library/DemoLibraryContent'));

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME, VIDEO_LIBRARY, DEMO_LIBRARY } = CommandBarModuleTypeSchema.enum;

interface FeatureContentContainerProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (feature: CommandBarModuleType | null) => void;
  isExpanded: boolean;
  onClose: () => void;
  onExpand: () => void;
}

// Component mapping for cleaner code
const CONTENT_COMPONENTS = {
  [ASK_AI]: withSuspenseWrapper(AskAiContent),
  [BOOK_MEETING]: withSuspenseWrapper(BookMeetingContent),
  [SUMMARIZE]: withSuspenseWrapper(SummarizeContent),
  [IFRAME]: withSuspenseWrapper(IframeContent),
  [VIDEO_LIBRARY]: withSuspenseWrapper(VideoLibraryContent),
  [DEMO_LIBRARY]: withSuspenseWrapper(DemoLibraryContent),
} as const;

const FeatureContentContainer = ({
  activeFeature,
  setActiveFeature,
  isExpanded,
  onClose,
  onExpand,
}: FeatureContentContainerProps) => {
  const { config } = useCommandBarStore();
  const { modules = [] } = config.command_bar ?? {};
  const module = modules.find((m) => m.module_type === activeFeature);

  useOutsideClick({ onOutsideClick: onClose });

  if (!module || !activeFeature) return null;

  const ContentComponent = CONTENT_COMPONENTS[activeFeature as keyof typeof CONTENT_COMPONENTS];
  if (!ContentComponent) return null;

  const commonProps = {
    isExpanded,
    onClose,
    onExpand,
    setActiveFeature,
  };

  // Special case for VIDEO_LIBRARY and DEMO_LIBRARY (always expanded)
  const wrapperIsExpanded = activeFeature === VIDEO_LIBRARY || activeFeature === DEMO_LIBRARY ? true : isExpanded;

  return (
    <FeatureContentWrapper activeFeature={activeFeature} isExpanded={wrapperIsExpanded}>
      <ContentComponent {...commonProps} />
    </FeatureContentWrapper>
  );
};

export default FeatureContentContainer;
