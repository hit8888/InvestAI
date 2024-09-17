import { Message } from "@meaku/core/types/chat";
import { useEffect, useRef } from "react";
import MessageItem from "./message-item";

type Props = {
  messages: Message[];
};

const ChatMessage = (props: Props) => {
  const { messages } = props;

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="ui-flex-1 ui-space-y-4 ui-overflow-y-auto ui-p-4">
      {messages.map((message) => (
        <MessageItem message={message} key={message.id} />
      ))}

      <div ref={endRef} className="ui-p-1" />
    </div>
  );
};

export default ChatMessage;
