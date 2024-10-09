import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import { memo, useMemo } from "react";
import useInitializeSessionData from "../../hooks/query/useInitializeSessionData";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import InitializeSessionResponseManager from "../../managers/InitializeSessionResponseManager";
import { useMessageStore } from "../../stores/useMessageStore";

const Embed = () => {
  const { session } = useInitializeSessionData();

  const manager = useMemo(() => {
    if (!session) return;

    return new InitializeSessionResponseManager(session);
  }, [session]);

  const orgName = manager?.getOrgName();
  const configuration = manager?.getConfig();
  const disclaimerText = configuration?.body.disclaimer_message ?? "";

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);
  const suggestedQuestions = useMessageStore(
    (state) => state.suggestedQuestions,
  );

  const { handleSendUserMessage, handlePrimaryCta } = useWebSocketChat();

  return (
    <div className="ui-flex ui-h-screen ui-flex-col">
      <ChatHeader
        orgName={orgName ?? ""}
        config={ChatConfig.EMBED}
        subtitle={configuration?.header.sub_title ?? ""}
        title={configuration?.header.title ?? ""}
        handlePrimaryCta={
          configuration?.body.show_cta ? handlePrimaryCta : undefined
        }
      />
      <ChatMessage
        messages={messages}
        suggestedQuestions={suggestedQuestions}
        handleSuggestedQuestionOnClick={handleSendUserMessage}
      />
      <ChatInput
        disclaimerText={disclaimerText}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        handleSendUserMessage={handleSendUserMessage}
      />
    </div>
  );
};

export default memo(Embed);
