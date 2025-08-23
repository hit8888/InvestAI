import { AskAiContent, BookMeetingContent, SummarizeContent, IframeContent } from '@meaku/shared/features';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import FeatureContentWrapper from './FeatureContentWrapper';
import { useCommandBarStore } from '@meaku/shared/stores';

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME } = CommandBarModuleTypeSchema.enum;

interface FeatureContentContainerProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (feature: CommandBarModuleType) => void;
  isExpanded: boolean;
  onClose: () => void;
  onExpand: () => void;
}

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

  if (!module) return null;

  switch (activeFeature) {
    case ASK_AI:
      return (
        <FeatureContentWrapper activeFeature={activeFeature} isExpanded={isExpanded}>
          <AskAiContent
            isExpanded={isExpanded}
            onClose={onClose}
            onExpand={onExpand}
            setActiveFeature={setActiveFeature}
          />
        </FeatureContentWrapper>
      );
    case BOOK_MEETING:
      return (
        <FeatureContentWrapper activeFeature={activeFeature} isExpanded={isExpanded}>
          <BookMeetingContent
            isExpanded={isExpanded}
            onClose={onClose}
            onExpand={onExpand}
            setActiveFeature={setActiveFeature}
          />
        </FeatureContentWrapper>
      );
    case SUMMARIZE:
      return (
        <FeatureContentWrapper activeFeature={activeFeature} isExpanded={isExpanded}>
          <SummarizeContent
            isExpanded={isExpanded}
            onClose={onClose}
            onExpand={onExpand}
            setActiveFeature={setActiveFeature}
          />
        </FeatureContentWrapper>
      );
    case IFRAME:
      return (
        <IframeContent
          isExpanded={isExpanded}
          onClose={onClose}
          onExpand={onExpand}
          setActiveFeature={setActiveFeature}
        />
      );
    default:
      return null;
  }
};

export default FeatureContentContainer;
