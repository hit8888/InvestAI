import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import TriggerButton from "@meaku/ui/components/layout/trigger-button";
import { cn } from "@meaku/ui/lib/cn";
import { memo, useEffect, useMemo } from "react";
import useInitializeSessionData from "../../hooks/query/useInitializeSessionData";
import useLocalStorageSession from "../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import InitializeSessionResponseManager from "../../managers/InitializeSessionResponseManager";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";

const Widget = () => {
  const { session } = useInitializeSessionData();

  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
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

  const manager = useMemo(() => {
    if (!session) return;

    return new InitializeSessionResponseManager(session);
  }, [session]);

  const orgName = manager?.getOrgName() ?? "";
  const agentName = manager?.getAgentName() ?? "";

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

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };

    window.parent.postMessage(payload, "*");
  }, [showTooltip, isChatOpen]);

  return (
    <div className="ui-flex ui-h-screen ui-flex-col">
      <div
        className={cn("ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden", {
          "ui-bg-white": isChatOpen,
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
            />
            <ChatMessage
              agentName={agentName}
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
