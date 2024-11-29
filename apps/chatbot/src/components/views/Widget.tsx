import { ChatConfig } from '@meaku/core/types/config';
import ChatHeader from '@breakout/design-system/components/layout/chat-header';
import ChatInput from '@breakout/design-system/components/layout/chat-input';
import ChatMessage from '@breakout/design-system/components/layout/chat-message';
import TriggerButton from '@breakout/design-system/components/layout/trigger-button';
import { cn } from '@breakout/design-system/lib/cn';
import { memo, useEffect, useState } from 'react';
import useLocalStorageSession from '../../hooks/useLocalStorageSession';
import { useChatStore } from '../../stores/useChatStore';
import { useMessageStore } from '../../stores/useMessageStore';
import useUnifiedConfigurationResponseManager from '../../pages/shared/hooks/useUnifiedConfigurationResponseManager';

interface IProps {
  fetchSessionData: () => void;
  handleSendUserMessage: (message: string) => Promise<void>;
}

const Widget = ({ fetchSessionData, handleSendUserMessage }: IProps) => {
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const hasFirstUserMessageBeenSent = useChatStore((state) => state.hasFirstUserMessageBeenSent);

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);

  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  const [initialSuggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const orgName = unifiedConfigurationResponseManager.getOrgName() ?? '';
  const configuration = unifiedConfigurationResponseManager.getConfig();
  const showCta = configuration.body.show_cta ?? false;
  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';

  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  const isChatOpen = sessionData.isChatOpen;

  const showTooltip = !isChatOpen && (sessionData?.showTooltip ?? true) && messages.length <= 1;

  const handleToggleChatOpenState = () => {
    handleUpdateSessionData({ isChatOpen: !isChatOpen });
  };

  const handleCloseTooltip = () => {
    handleUpdateSessionData({ showTooltip: false });
  };

  const handleCloseChat = () => {
    handleUpdateSessionData({ isChatOpen: false });
  };

  useEffect(() => {
    const suggestedQuestions: string[] = unifiedConfigurationResponseManager.getInitialSuggestedQuestions();
    setSuggestedQuestions(suggestedQuestions);
    const chatHistory = unifiedConfigurationResponseManager.getFormattedChatHistory({
      isAdmin: false,
      isReadOnly: false,
    });
    setMessages(chatHistory);
  }, []);

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };

    window.parent.postMessage(payload, '*');
  }, [showTooltip, isChatOpen]);

  return (
    <div className="flex h-screen flex-col">
      <div
        className={cn('flex flex-1 flex-col overflow-hidden', {
          'bg-white': isChatOpen,
        })}
      >
        {isChatOpen && (
          <>
            <ChatHeader
              agentName={agentName}
              orgName={orgName}
              config={ChatConfig.WIDGET}
              showMinimizedHeader={hasFirstUserMessageBeenSent}
              handleClose={handleCloseChat}
              handlePrimaryCta={
                showCta ? () => handleSendUserMessage('I want to book a demo for the product.') : undefined
              }
            />
            <ChatMessage
              agentName={agentName}
              messages={messages}
              suggestedQuestions={initialSuggestedQuestions}
              handleSuggestedQuestionOnClick={(selectedMessage) => {
                fetchSessionData();
                if (!isChatOpen) {
                  handleUpdateSessionData({ isChatOpen: true });
                }
                setSuggestedQuestions([]);
                handleSendUserMessage(selectedMessage);
              }}
            />
            <ChatInput
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              handleChatInputOnChangeCallback={fetchSessionData}
              handleSendUserMessage={(selectedMessage) => {
                fetchSessionData();
                if (!isChatOpen) {
                  handleUpdateSessionData({ isChatOpen: true });
                }
                setSuggestedQuestions([]);
                handleSendUserMessage(selectedMessage);
              }}
            />
          </>
        )}
      </div>

      <TriggerButton
        isChatOpen={isChatOpen}
        showTooltip={showTooltip}
        suggestedQuestions={initialSuggestedQuestions}
        handleToggleChatOpenState={handleToggleChatOpenState}
        handleCloseTooltip={handleCloseTooltip}
        handleSuggestionsOnClick={(selectedMessage) => {
          fetchSessionData();
          if (!isChatOpen) {
            handleUpdateSessionData({ isChatOpen: true });
          }
          setSuggestedQuestions([]);
          handleSendUserMessage(selectedMessage);
        }}
      />
    </div>
  );
};

export default memo(Widget);
