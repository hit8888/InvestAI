import {
  AskAiContent,
  BookMeetingContent,
  SummarizeContent,
  IframeContent,
  VideoLibraryContent,
} from '@meaku/shared/features';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import FeatureContentWrapper from './FeatureContentWrapper';
import { useCommandBarStore } from '@meaku/shared/stores';

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME, VIDEO_LIBRARY } = CommandBarModuleTypeSchema.enum;

interface FeatureContentContainerProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (feature: CommandBarModuleType | null) => void;
  isExpanded: boolean;
  onClose: () => void;
  onExpand: () => void;
}

// Component mapping for cleaner code
const CONTENT_COMPONENTS = {
  [ASK_AI]: AskAiContent,
  [BOOK_MEETING]: BookMeetingContent,
  [SUMMARIZE]: SummarizeContent,
  [IFRAME]: IframeContent,
  [VIDEO_LIBRARY]: VideoLibraryContent,
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

  if (!module || !activeFeature) return null;

  const ContentComponent = CONTENT_COMPONENTS[activeFeature as keyof typeof CONTENT_COMPONENTS];
  if (!ContentComponent) return null;

  const commonProps = {
    isExpanded,
    onClose,
    onExpand,
    setActiveFeature,
  };

  // Special cases that don't use FeatureContentWrapper
  if (activeFeature === IFRAME) {
    return <ContentComponent {...commonProps} />;
  }

  // Special case for VIDEO_LIBRARY (always expanded)
  const wrapperIsExpanded = activeFeature === VIDEO_LIBRARY ? true : isExpanded;

  return (
    <FeatureContentWrapper activeFeature={activeFeature} isExpanded={wrapperIsExpanded}>
      <ContentComponent {...commonProps} />
    </FeatureContentWrapper>
  );
};

export default FeatureContentContainer;
