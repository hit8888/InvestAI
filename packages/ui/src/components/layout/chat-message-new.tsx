import { Message } from "@meaku/core/types/chat";
import { useEffect, useRef } from "react";
import MessageItemNew from "./message-item-new";

interface IProps {
  messages: Message[];
}

const ChatMessageNew = (props: IProps) => {
  const { messages } = props;

  const endRef = useRef<HTMLDivElement>(null);

  const handleScrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [messages.length]);

  return (
    <div className="ui-flex-1 ui-space-y-4 ui-overflow-y-auto ui-bg-white ui-bg-opacity-60 ui-p-2">
      {/* {messages.map((message) => (
        <MessageItemNew key={message.id} message={message} />
      ))} */}
      <div className="ui-mx-auto ui-h-full ui-w-full sm:ui-max-w-[85%] lg:ui-max-w-[80%] xl:ui-max-w-[70%] 2xl:ui-max-w-[60%]">
        {messages.map((message) => (
          <MessageItemNew key={message.id} message={message} />
        ))}
      </div>

      <div ref={endRef} className="ui-p-1" />
    </div>
  );
};

export default ChatMessageNew;
