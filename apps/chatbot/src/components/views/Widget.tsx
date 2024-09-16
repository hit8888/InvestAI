import { ChatConfig } from "@meaku/core/types/config";
import ChatHeader from "@meaku/ui/components/layout/chat-header";
import ChatInput from "@meaku/ui/components/layout/chat-input";
import ChatMessage from "@meaku/ui/components/layout/chat-message";
import TriggerButton from "@meaku/ui/components/layout/trigger-button";

const Widget = () => {
  return (
    <div className="ui-flex ui-h-screen ui-flex-col">
      <div className="ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden">
        <ChatHeader orgName="C2FO" config={ChatConfig.WIDGET} />
        <ChatMessage />
        <ChatInput disclaimerText="If the chat gets disrupted, please fill out the Contact Us form below and our team will reach out to provide continued support." />
      </div>

      <TriggerButton />
    </div>
  );
};

export default Widget;
