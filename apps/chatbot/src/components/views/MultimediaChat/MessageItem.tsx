import BotIndicator from "@breakout/design-system/components/layout/bot-indicator";
import { cn } from "@breakout/design-system/lib/cn";
import { Message } from "@meaku/core/types/chat";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import useInView from "../../../hooks/useInView";
import ArtifactPreview from "./ArtifactPreview";
import ChatArtifact from "./ChatArtifact.tsx";

interface IProps {
  message: Message;
  messageIndex: number;
  totalMessages: number;
}

const MessageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
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
  const { message, messageIndex, totalMessages } = props;

  const [isSingleLineMessage, setIsSingleLineMessage] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);
  const { isInView, ref: inViewRef } = useInView(0, true);

  const isSenderBot = message.role === "ai";
  const isLoading = message.is_loading;

  const messageArtifactId = message.artifact?.artifact_id;
  const messageArtifactType = message.artifact?.artifact_type;

  const showArtifactPreview = messageIndex >= totalMessages - 4;
  const isLastMessage = messageIndex === totalMessages - 1;

  const showMessageArtifactPreview =
    !isLastMessage &&
    (showArtifactPreview || isInView) &&
    !!messageArtifactId &&
    messageArtifactType !== "NONE";

  const reactMarkdownComponents: Partial<Components> = {
    a: MessageLink,
    strong: MessageStrong,
  };

  useEffect(() => {
    if (messageRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(messageRef.current).lineHeight,
      );
      const height = messageRef.current.scrollHeight;

      if (isSingleLineMessage === height <= lineHeight) return;

      setIsSingleLineMessage(height <= lineHeight);
    }
  }, [message.message, isSingleLineMessage]);

  return (
    <div ref={inViewRef}>
      <div
        className={cn("flex items-center", {
          "justify-end": !isSenderBot,
        })}
      >
        <div
          className={cn("max-w-full", {
            "ml-10 bg-primary/70 px-3 py-2": !isSenderBot,
            "mr-10 flex gap-7 p-6 pl-0": isSenderBot,
            "rounded-full": isSingleLineMessage,
            "rounded-2xl": !isSingleLineMessage,
          })}
        >
          {isSenderBot && (
            <>
              <BotIndicator />
            </>
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
      <div className="ml-auto flex flex-col">
        {message.chatArtifact && (
          <ChatArtifact
            artifact={message.chatArtifact}
            messageIndex={messageIndex}
            totalMessages={totalMessages}
          />
        )}
      </div>

      {showMessageArtifactPreview && (
        <ArtifactPreview
          artifactId={messageArtifactId}
          artifactType={messageArtifactType as string}
        />
      )}
    </div>
  );
};

export default MessageItem;
