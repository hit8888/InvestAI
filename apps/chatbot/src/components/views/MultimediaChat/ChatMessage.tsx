import { Message } from "@meaku/core/types/chat";
import { cn } from "@meaku/ui/lib/cn";
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

interface IProps {
  messages: Message[];
  isInSplitScreenView?: boolean;
}

const ChatMessage = (props: IProps) => {
  const { messages, isInSplitScreenView = false } = props;

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const handleScrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;

      if (isAtBottom) {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 space-y-4 overflow-y-auto bg-white bg-opacity-60 p-2"
    >
      <div
        className={cn("mx-auto h-full w-full", {
          "sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]":
            !isInSplitScreenView,
        })}
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isInSplitScreenView={isInSplitScreenView}
          />
        ))}
      </div>

      <div ref={endRef} className="p-1" />
    </div>
  );
};

export default ChatMessage;
