import { ChatConfig } from '@meaku/core/types/config';
import ChatHeader from '@breakout/design-system/components/layout/chat-header';
import ChatInput from '@breakout/design-system/components/layout/chat-input';
import ChatMessage from '@breakout/design-system/components/layout/chat-message';
import { memo, useEffect, useState } from 'react';
import { useMessageStore } from '../../stores/useMessageStore';
import useUnifiedConfigurationResponseManager from '../../pages/shared/hooks/useUnifiedConfigurationResponseManager';

interface IProps {
  fetchSessionData: () => void;
  handleSendUserMessage: (message: string) => Promise<void>;
}

const Embed = ({ fetchSessionData, handleSendUserMessage }: IProps) => {
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const orgName = unifiedConfigurationResponseManager.getOrgName();
  const configuration = unifiedConfigurationResponseManager.getConfig();
  const disclaimerText = configuration?.body.disclaimer_message ?? '';
  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';
  const showCta = configuration?.body.show_cta ?? false;

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  const [initialSuggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const suggestedQuestions: string[] = unifiedConfigurationResponseManager.getInitialSuggestedQuestions({
      isAdmin: false,
      isReadOnly: false,
    });
    setSuggestedQuestions(suggestedQuestions);
    const chatHistory = unifiedConfigurationResponseManager.getFormattedChatHistory({
      isAdmin: false,
      isReadOnly: false,
    });
    setMessages(chatHistory);
  }, []);

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
        suggestedQuestions={initialSuggestedQuestions}
        handleSuggestedQuestionOnClick={(selectedMessage) => {
          fetchSessionData();
          setSuggestedQuestions([]);
          handleSendUserMessage(selectedMessage);
        }}
      />
      <ChatInput
        disclaimerText={disclaimerText}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        handleChatInputOnChangeCallback={fetchSessionData}
        handleSendUserMessage={(selectedMessage) => {
          fetchSessionData();
          setSuggestedQuestions([]);
          handleSendUserMessage(selectedMessage);
        }}
      />
    </div>
  );
};

export default memo(Embed);
