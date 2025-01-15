import AgentHeader from '@breakout/design-system/components/layout/agent-header';
import AgentInput from '@breakout/design-system/components/layout/agent-input';
import AgentMessage from '@breakout/design-system/components/layout/agent-message';
import { memo, useEffect, useState } from 'react';
import { useMessageStore } from '../../stores/useMessageStore';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import useWebSocketChat from '../../hooks/useWebSocketChat';

interface IProps {
  fetchSessionData: () => void;
}

const Embed = ({ fetchSessionData }: IProps) => {
  const { handleSendUserMessage } = useWebSocketChat();

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
    const suggestedQuestions: string[] = unifiedConfigurationResponseManager.getInitialSuggestedQuestions();
    setSuggestedQuestions(suggestedQuestions);
    const chatHistory = unifiedConfigurationResponseManager.getFormattedChatHistory({
      isAdmin: false,
      isReadOnly: false,
    });
    setMessages(chatHistory);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <AgentHeader
        agentName={agentName}
        orgName={orgName ?? ''}
        subtitle={configuration?.header.sub_title ?? ''}
        handlePrimaryCta={
          showCta ? () => handleSendUserMessage({ message: 'I want to book a demo for the product.' }) : undefined
        }
      />
      <AgentMessage
        agentName={agentName}
        messages={messages}
        suggestedQuestions={initialSuggestedQuestions}
        handleSuggestedQuestionOnClick={(selectedMessage) => {
          fetchSessionData();
          setSuggestedQuestions([]);
          handleSendUserMessage({ message: selectedMessage });
        }}
      />
      <AgentInput
        disclaimerText={disclaimerText}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        handleAgentInputOnChangeCallback={fetchSessionData}
        handleSendUserMessage={(selectedMessage) => {
          fetchSessionData();
          setSuggestedQuestions([]);
          handleSendUserMessage({ message: selectedMessage });
        }}
      />
    </div>
  );
};

export default memo(Embed);
