import { Message } from "@meaku/core/types/chat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { cn } from "@meaku/ui/lib/cn";

interface IProps {
  message: Message;
}

const MesageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return (
    <a
      className="ui-text-primary"
      href={href}
      {...rest}
      target="_blank"
      rel="noreferrer"
    />
  );
};

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => {
  return <strong className="ui-text-gray-600" {...props} />;
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
      className={cn("ui-flex ui-items-center", {
        "ui-justify-end": !isSenderBot,
      })}
    >
      <div
        className={cn({
          "ui-bg-primary ui-px-3 ui-py-2": !isSenderBot,
          "ui-flex ui-gap-7 ui-p-6 ui-pl-0": isSenderBot,
          "ui-rounded-full": isSingleLineMessage,
          "ui-rounded-2xl": !isSingleLineMessage,
        })}
      >
        {isSenderBot && (
          <div className="bot-indicator ui-h-4 ui-w-4 ui-min-w-max ui-rounded-full ui-bg-primary"></div>
        )}
        <div
          className={cn("ui-prose ui-max-w-full ui-flex-1", {
            "ui-text-primary-foreground": !isSenderBot,
            "ui-leading-snug ui-text-gray-600": isSenderBot,
            "ui-animate-pulse": isLoading,
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
