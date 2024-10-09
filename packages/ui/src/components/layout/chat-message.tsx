import { Message } from "@meaku/core/types/chat";
import { InitialFeedbackPayload } from "@meaku/core/types/feedback";
import debounce from "lodash/debounce";
import { useEffect, useRef } from "react";
import MessageItem from "./message-item";
import SuggestedQuestion from "./suggested-question";

type Props = {
  messages: Message[];
  suggestedQuestions: string[];
  activeResponseId?: string;
  handleSuggestedQuestionOnClick: (question: string) => void;
  handleShareInitialFeedback?: (payload: InitialFeedbackPayload) => void;
};

const ChatMessage = (props: Props) => {
  const {
    messages,
    suggestedQuestions,
    activeResponseId,
    handleSuggestedQuestionOnClick,
    handleShareInitialFeedback,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const activeResponseIdRef = useRef<string | null>(null);

  const handleScrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToActiveResponse = debounce(() => {
    const activeResponseId = activeResponseIdRef.current;
    if (!activeResponseId) return;

    const id = `message-${activeResponseId}`;
    const activeResponseElement = document.getElementById(id);

    if (!activeResponseElement) return;

    activeResponseElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, 100);

  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver(
      handleScrollToActiveResponse,
    );

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (activeResponseId === activeResponseIdRef.current) return;
    activeResponseIdRef.current = activeResponseId ?? null;
  }, [activeResponseId]);

  useEffect(() => {
    handleScrollToBottom();
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="ui-flex-1 ui-space-y-4 ui-overflow-y-auto ui-bg-white ui-p-4"
    >
      {messages.map((message) => (
        <MessageItem
          message={message}
          handleShareInitialFeedback={handleShareInitialFeedback}
          key={message.id}
        />
      ))}

      <div className="ui-space-y-2">
        {suggestedQuestions.map((question) => (
          <SuggestedQuestion
            key={question}
            question={question}
            handleOnClick={handleSuggestedQuestionOnClick}
          />
        ))}
      </div>

      <div ref={endRef} className="ui-p-1" />
    </div>
  );
};

export default ChatMessage;
