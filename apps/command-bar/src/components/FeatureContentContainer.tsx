import { useMemo } from 'react';
import { AskAiContent, BookMeetingContent, SummarizeContent, IframeContent } from '@meaku/shared/features';
import { querySelector } from '@meaku/shared/utils/dom-utils';
import type {
  CommandBarModuleConfigType,
  ConfigurationApiResponse,
} from '@meaku/core/types/api/configuration_response';
import type { Message } from '@meaku/shared/types/message';
import type { CommandBarPosition } from '@meaku/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import FeatureContentWrapper from '@meaku/shared/components/FeatureContentWrapper';
import { CommandBarSettings } from '@meaku/core/types/common';
import { useCommandBarStore } from '../stores/useCommandBarStore';

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME } = CommandBarModuleTypeSchema.enum;

interface FeatureContentContainerProps {
  settings: CommandBarSettings;
  position: CommandBarPosition;
  module: CommandBarModuleConfigType | null;
  onClose: () => void;
  onExpand: () => void;
  isExpanded: boolean;
  config: ConfigurationApiResponse;
  messages: Message[];
  isInitialising: boolean;
  isLoading: boolean;
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
}

const getActiveButtonBottom = (moduleType: string) => {
  const buttonElement = querySelector(`[data-button-id="action-${moduleType}"]`) as HTMLButtonElement;
  if (!buttonElement) return 0;
  const rect = buttonElement.getBoundingClientRect();
  return window.innerHeight - rect.bottom;
};

const FeatureContentContainer = ({
  settings,
  module,
  isExpanded,
  onClose,
  onExpand,
  config,
  messages,
  sendUserMessage,
  isInitialising,
  isLoading,
}: FeatureContentContainerProps) => {
  const {
    suggestedQuestions,
    isStreaming,
    getRenderableMessages,
    isDiscoveryQuestionShown,
    clearSuggestedQuestionsIfDiscoveryShown,
  } = useCommandBarStore();

  const askaiConfig = useMemo(
    () => ({
      agent_name: config?.agent_name ?? '',
      welcome_message: config?.body?.welcome_message ?? '',
      ctas: [
        {
          text: config.body.cta_config?.text ?? 'Contact Sales',
          message: config.body.cta_config?.message ?? 'I want to book a demo for the product.',
          url: config.body.cta_config?.url ?? '',
        },
      ],
      welcomeQuestions: config?.body?.welcome_message?.suggested_questions ?? [],
    }),
    [config],
  );

  if (!module) return null;

  const bottom = getActiveButtonBottom(module.id.toString());

  switch (module.module_type) {
    case ASK_AI:
      return (
        <FeatureContentWrapper bottom={bottom} isExpanded={isExpanded}>
          <AskAiContent
            askaiConfig={askaiConfig}
            onClose={onClose}
            onExpand={onExpand}
            messages={messages}
            isInitialising={isInitialising}
            isLoading={isLoading}
            isExpanded={isExpanded}
            sendUserMessage={sendUserMessage}
            config={config}
            settings={settings}
            suggestedQuestions={suggestedQuestions}
            isStreaming={isStreaming}
            getRenderableMessages={getRenderableMessages}
            isDiscoveryQuestionShown={isDiscoveryQuestionShown}
            clearSuggestedQuestionsIfDiscoveryShown={clearSuggestedQuestionsIfDiscoveryShown}
          />
        </FeatureContentWrapper>
      );
    case BOOK_MEETING:
      return (
        <FeatureContentWrapper bottom={bottom} isExpanded={isExpanded}>
          <BookMeetingContent
            onClose={onClose}
            onExpand={onExpand}
            messages={messages}
            isInitialising={isInitialising}
            handleSendUserMessage={(data) => sendUserMessage?.(data.message, data.overrides)}
          />
        </FeatureContentWrapper>
      );
    case SUMMARIZE:
      return (
        <FeatureContentWrapper bottom={bottom} isExpanded={isExpanded}>
          <SummarizeContent
            onClose={onClose}
            onExpand={onExpand}
            isExpanded={isExpanded}
            config={config}
            settings={settings}
          />
        </FeatureContentWrapper>
      );
    case IFRAME:
      return <IframeContent settings={settings} config={config} featureConfig={module} onClose={onClose} />;
    default:
      return null;
  }
};

export default FeatureContentContainer;
