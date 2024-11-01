import { Message } from "@meaku/core/types/chat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { cn } from "@breakout/design-system/lib/cn";

interface IProps {
  message: Message;
}

const MesageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return (
    <a
      className="text-primary"
      href={href}
      {...rest}
      target="_blank"
      rel="noreferrer"
    />
  );
};

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => {
  return <strong className="text-gray-600" {...props} />;
};

const MessageItem = (props: IProps) => {
  const { message } = props;

  const [isSingleLineMessage, setIsSingleLineMessage] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);

  const isSenderBot = message.role === "ai";
  const isLoading = message.is_loading;

  const reactMarkdownComponents: Partial<Components> = {
    a: MesageLink,
    strong: MessageStrong,
  };

  useEffect(() => {
    if (messageRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(messageRef.current).lineHeight,
      );
      const height = messageRef.current.scrollHeight;
      setIsSingleLineMessage(height <= lineHeight);
    }
  }, [message.message]);

  return (
    <div
      className={cn("flex items-center", {
        "justify-end": !isSenderBot,
      })}
    >
      <div
        className={cn({
          "bg-primary px-3 py-2": !isSenderBot,
          "flex gap-7 p-6 pl-0": isSenderBot,
          "rounded-full": isSingleLineMessage,
          "rounded-2xl": !isSingleLineMessage,
        })}
      >
        {isSenderBot && (
          <div className="bot-indicator h-4 w-4 min-w-max rounded-full bg-primary"></div>
        )}
        <div
          className={cn("prose max-w-full flex-1", {
            "text-primary-foreground": !isSenderBot,
            "leading-snug text-gray-600": isSenderBot,
            "animate-pulse": isLoading,
          })}
          ref={messageRef}
        >
          <ReactMarkdown
            remarkPlugins={[gfm]}
            components={reactMarkdownComponents}
          >
            {message.message}
          </ReactMarkdown>
        </div>

        {/* TODO: Add link preview */}
        {/* <div></div> */}
      </div>
    </div>
  );
};

export default MessageItem;
