import { ChatConfig } from '@meaku/core/types/config';
import ChatHeader from '@breakout/design-system/components/layout/chat-header';
import ChatInput from '@breakout/design-system/components/layout/chat-input';
import ChatMessage from '@breakout/design-system/components/layout/chat-message';
import { memo } from 'react';
import useWebSocketChat from '../../hooks/useWebSocketChat';
import { useMessageStore } from '../../stores/useMessageStore';
import useUnifiedConfigurationResponseManager from '../../pages/shared/hooks/useUnifiedConfigurationResponseManager';

interface IProps {
  fetchSessionData: () => void;
}

const Embed = ({ fetchSessionData }: IProps) => {
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const orgName = unifiedConfigurationResponseManager.getOrgName();
  const configuration = unifiedConfigurationResponseManager.getConfig();
  const disclaimerText = configuration?.body.disclaimer_message ?? '';
  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';
  const showCta = configuration?.body.show_cta ?? false;
  const suggestedQuestions = unifiedConfigurationResponseManager.getSuggestedQuestions({
    isAdmin: false,
    isReadOnly: false,
  });

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const messages = useMessageStore((state) => state.messages);

  const { handleSendUserMessage } = useWebSocketChat();

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader
        agentName={agentName}
        orgName={orgName ?? ''}
        config={ChatConfig.EMBED}
        subtitle={configuration?.header.sub_title ?? ''}
        title={configuration?.header.title ?? ''}
        handlePrimaryCta={showCta ? () => handleSendUserMessage('I want to book a demo for the product.') : undefined}
      />
      <ChatMessage
        agentName={agentName}
        messages={messages}
        suggestedQuestions={suggestedQuestions}
        handleSuggestedQuestionOnClick={handleSendUserMessage}
      />
      <ChatInput
        disclaimerText={disclaimerText}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        handleChatInputOnChangeCallback={fetchSessionData}
        handleSendUserMessage={(selectedMessage) => {
          fetchSessionData();
          handleSendUserMessage(selectedMessage);
        }}
      />
    </div>
  );
};

export default memo(Embed);
