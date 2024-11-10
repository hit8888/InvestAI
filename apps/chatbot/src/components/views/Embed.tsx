import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@breakout/design-system/components/layout/chat-header";
import ChatInput from "@breakout/design-system/components/layout/chat-input";
import ChatMessage from "@breakout/design-system/components/layout/chat-message";
import { memo, useMemo } from "react";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import UnifiedResponseManager from "../../../../../packages/core/src/managers/UnifiedSessionConfigResponseManager";
import { useMessageStore } from "../../stores/useMessageStore";
import useConfigDataQuery from "@meaku/core/queries/useConfigDataQuery";

const Embed = () => {
  const { data: config } = useConfigDataQuery();
  const { session, refetch: fetchSessionData } = useInitializeSessionDataQuery();

  const manager = useMemo(() => {
    if (!session && !config) return;

    return new UnifiedResponseManager(session ?? config);
  }, [config, session]);

  const orgName = manager?.getOrgName();
  const configuration = manager?.getConfig();
  const disclaimerText = configuration?.body.disclaimer_message ?? "";
  const agentName = manager?.getAgentName() ?? "";
  const sessionId = manager?.getSessionId();
  const showCta = configuration?.body.show_cta ?? false;

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);
  const suggestedQuestions = useMessageStore(
    (state) => state.suggestedQuestions,
  );

  const { handleSendUserMessage, handlePrimaryCta } = useWebSocketChat();

  const handleChatInputOnChangeCallback = () => {
    if (sessionId) return;

    fetchSessionData();
  };

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader
        agentName={agentName}
        orgName={orgName ?? ""}
        config={ChatConfig.EMBED}
        subtitle={configuration?.header.sub_title ?? ""}
        title={configuration?.header.title ?? ""}
        handlePrimaryCta={showCta ? handlePrimaryCta : undefined}
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
        handleChatInputOnChangeCallback={handleChatInputOnChangeCallback}
        handleSendUserMessage={handleSendUserMessage}
      />
    </div>
  );
};

export default memo(Embed);
