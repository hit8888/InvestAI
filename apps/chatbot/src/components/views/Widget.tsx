import { ChatConfig } from '@meaku/core/types/config';
import ChatHeader from '@breakout/design-system/components/layout/chat-header';
import ChatInput from '@breakout/design-system/components/layout/chat-input';
import ChatMessage from '@breakout/design-system/components/layout/chat-message';
import TriggerButton from '@breakout/design-system/components/layout/trigger-button';
import { cn } from '@breakout/design-system/lib/cn';
import { memo, useEffect } from 'react';
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
  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const hasFirstUserMessageBeenSent = useChatStore((state) => state.hasFirstUserMessageBeenSent);

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);

  const messages = unifiedConfigurationResponseManager.getFormattedChatHistory({ isAdmin: false, isReadOnly: false });
  const initialSuggestedQuestions = unifiedConfigurationResponseManager.getInitialSuggestedQuestions({
    isAdmin: false,
    isReadOnly: false,
  });

  const orgName = unifiedConfigurationResponseManager.getOrgName() ?? '';
  const configuration = unifiedConfigurationResponseManager.getConfig();
  const showCta = configuration.body.show_cta ?? false;
  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';

  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  const showTooltip = !isChatOpen && (sessionData?.showTooltip ?? true) && messages.length <= 1;

  const handleToggleChatOpenState = () => {
    setIsChatOpen((previous) => !previous);
  };

  const handleCloseTooltip = () => {
    handleUpdateSessionData({ showTooltip: false });
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

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
              handleSuggestedQuestionOnClick={handleSendUserMessage}
            />
            <ChatInput
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              handleChatInputOnChangeCallback={fetchSessionData}
              handleSendUserMessage={(selectedMessage) => {
                fetchSessionData();
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
        handleSuggestionsOnClick={handleSendUserMessage}
      />
    </div>
  );
};

export default memo(Widget);
