import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import TriggerButton from "@meaku/ui/components/layout/trigger-button";
import { memo } from "react";
import useLocalStorageSession from "../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";

const Widget = () => {
  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const orgName = useChatStore((state) => state.orgName) ?? "";
  const session = useChatStore((state) => state.session);
  const hasFirstUserMessageBeenSent = useChatStore(
    (state) => state.hasFirstUserMessageBeenSent,
  );

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);
  const suggestedQuestions = useMessageStore(
    (state) => state.suggestedQuestions,
  );

  const { handleSendUserMessage } = useWebSocketChat();
  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

  const tooltipSuggestedQuestions =
    session?.configuration.body.welcome_message.suggested_questions ?? [];
  const showTooltip =
    !isChatOpen && (sessionData?.showTooltip ?? true) && messages.length <= 1;

  const handleToggleChatOpenState = () => {
    setIsChatOpen((previous) => !previous);
  };

  const handleCloseTooltip = () => {
    handleUpdateSessionData({ showTooltip: false });
  };

  return (
    <div className="ui-flex ui-h-screen ui-flex-col">
      <div className="ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden">
        {isChatOpen && (
          <>
            <ChatHeader
              orgName={orgName}
              config={ChatConfig.WIDGET}
              showMinimizedHeader={hasFirstUserMessageBeenSent}
            />
            <ChatMessage
              messages={messages}
              suggestedQuestions={suggestedQuestions}
              handleSuggestedQuestionOnClick={handleSendUserMessage}
            />
            <ChatInput
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              handleSendUserMessage={handleSendUserMessage}
            />
          </>
        )}
      </div>

      <TriggerButton
        isChatOpen={isChatOpen}
        showTooltip={showTooltip}
        suggestedQuestions={tooltipSuggestedQuestions}
        handleToggleChatOpenState={handleToggleChatOpenState}
        handleCloseTooltip={handleCloseTooltip}
        handleSuggestionsOnClick={handleSendUserMessage}
      />
    </div>
  );
};

export default memo(Widget);
