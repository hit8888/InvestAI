import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@breakout/design-system/components/layout/chat-header";
import ChatInput from "@breakout/design-system/components/layout/chat-input";
import ChatMessage from "@breakout/design-system/components/layout/chat-message";
import TriggerButton from "@breakout/design-system/components/layout/trigger-button";
import { cn } from "@breakout/design-system/lib/cn";
import { memo, useEffect, useMemo } from "react";
import useConfigData from "../../hooks/query/useConfigData";
import useInitializeSessionData from "../../hooks/query/useInitializeSessionData";
import useLocalStorageSession from "../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import UnifiedResponseManager from "../../managers/UnifiedSessionConfigResponseManager";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";

const Widget = () => {
  const { data: config } = useConfigData();
  const { session, refetch: fetchSessionData } = useInitializeSessionData();

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
    if (!session && !config) return;

    return new UnifiedResponseManager(session ?? config);
  }, [config, session]);

  const orgName = manager?.getOrgName() ?? "";
  const configuration = manager?.getConfig();
  const showCta = configuration?.body.show_cta ?? false;
  const agentName = manager?.getAgentName() ?? "";
  const sessionId = manager?.getSessionId();

  const { handleSendUserMessage, handlePrimaryCta } = useWebSocketChat();
  const { sessionData, handleUpdateSessionData } = useLocalStorageSession();

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

  const handleChatInputOnChangeCallback = () => {
    if (sessionId) return;

    fetchSessionData();
  };

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };

    window.parent.postMessage(payload, "*");
  }, [showTooltip, isChatOpen]);

  return (
    <div className="flex h-screen flex-col">
      <div
        className={cn("flex flex-1 flex-col overflow-hidden", {
          "bg-white": isChatOpen,
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
              handlePrimaryCta={showCta ? handlePrimaryCta : undefined}
            />
            <ChatMessage
              agentName={agentName}
              messages={messages}
              suggestedQuestions={suggestedQuestions}
              handleSuggestedQuestionOnClick={handleSendUserMessage}
            />
            <ChatInput
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              handleChatInputOnChangeCallback={handleChatInputOnChangeCallback}
              handleSendUserMessage={handleSendUserMessage}
            />
          </>
        )}
      </div>

      <TriggerButton
        isChatOpen={isChatOpen}
        showTooltip={showTooltip}
        suggestedQuestions={suggestedQuestions}
        handleToggleChatOpenState={handleToggleChatOpenState}
        handleCloseTooltip={handleCloseTooltip}
        handleSuggestionsOnClick={handleSendUserMessage}
      />
    </div>
  );
};

export default memo(Widget);
