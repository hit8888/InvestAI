import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import TriggerButton from "@meaku/ui/components/layout/trigger-button";
import useWebSocketChat from "../../hooks/useWebSocketChat";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";

const Widget = () => {
  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const orgName = useChatStore((state) => state.orgName) || "";

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);

  const { handleSendUserMessage } = useWebSocketChat();

  const handleToggleChatOpenState = () => {
    setIsChatOpen((previous) => !previous);
  };

  return (
    <div className="ui-flex ui-h-screen ui-flex-col">
      <div className="ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden">
        {isChatOpen && (
          <>
            <ChatHeader orgName={orgName} config={ChatConfig.WIDGET} />
            <ChatMessage messages={messages} />
            <ChatInput
              disclaimerText="If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support."
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              handleSendUserMessage={handleSendUserMessage}
            />
          </>
        )}
      </div>

      <TriggerButton
        isChatOpen={isChatOpen}
        handleToggleChatOpenState={handleToggleChatOpenState}
      />
    </div>
  );
};

export default Widget;
