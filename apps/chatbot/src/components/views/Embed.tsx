import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@breakout/design-system/components/layout/chat-header";
import ChatInput from "@breakout/design-system/components/layout/chat-input";
import ChatMessage from "@breakout/design-system/components/layout/chat-message";
import { memo } from "react";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import { useMessageStore } from "../../stores/useMessageStore";
import useUnifiedConfigurationResponseManager from "../../pages/Chat/hooks/useUnifiedConfigurationResponseManager";
import { ApiProviderContext } from "../../pages/Chat/ApiProvider/Context";
import { useContextSelector } from "use-context-selector";

const Embed = () => {
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery)

  const orgName = unifiedConfigurationResponseManager.getOrgName();
  const configuration = unifiedConfigurationResponseManager.getConfig();
  const disclaimerText = configuration?.body.disclaimer_message ?? "";
  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? "";
  const sessionId = unifiedConfigurationResponseManager.getSessionId();
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

    sessionQuery.refetch();
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
