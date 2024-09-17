import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";

const Embed = () => {
  const orgName = useChatStore((state) => state.orgName);
  const configuration = useChatStore((state) => state.configuration);
  const hasFirstUserMessageBeenSent = useChatStore(
    (state) => state.hasFirstUserMessageBeenSent,
  );

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);

  const { handleSendUserMessage } = useWebSocketChat();

  const logoURL = configuration?.logo;

  return (
    <div className="ui-flex ui-h-screen ui-flex-col">
      <ChatHeader
        orgName={orgName || ""}
        config={ChatConfig.EMBED}
        logoURL={logoURL || ""}
        showMinimizedHeader={hasFirstUserMessageBeenSent}
        subtitle={configuration?.header.sub_title || ""}
        title={configuration?.header.title || ""}
      />
      <ChatMessage messages={messages} />
      <ChatInput
        disclaimerText="If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support."
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        handleSendUserMessage={handleSendUserMessage}
      />
    </div>
  );
};

export default Embed;
