import { Message } from "@meaku/core/types/chat";
import { InitialFeedbackPayload } from "@meaku/core/types/feedback";
import debounce from "lodash/debounce";
import { useEffect, useRef } from "react";
import MessageItem from "./message-item";
import SuggestedQuestion from "./suggested-question";

type Props = {
  agentName: string;
  messages: Message[];
  suggestedQuestions: string[];
  activeResponseId?: string;
  handleSuggestedQuestionOnClick: (question: string) => void;
  handleShareInitialFeedback?: (payload: InitialFeedbackPayload) => void;
  handleShowFeedback?: (responseId: string) => void;
};

const ChatMessage = (props: Props) => {
  const {
    agentName,
    messages,
    suggestedQuestions,
    activeResponseId,
    handleSuggestedQuestionOnClick,
    handleShareInitialFeedback,
    handleShowFeedback,
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
      className="flex-1 space-y-4 overflow-y-auto bg-white p-4"
    >
      {messages.map((message) => (
        <MessageItem
          agentName={agentName}
          message={message}
          handleShareInitialFeedback={handleShareInitialFeedback}
          handleShowFeedback={handleShowFeedback}
          key={message.id}
        />
      ))}

      <div className="space-y-2">
        {suggestedQuestions.map((question) => (
          <SuggestedQuestion
            key={question}
            question={question}
            handleOnClick={handleSuggestedQuestionOnClick}
          />
        ))}
      </div>

      <div ref={endRef} className="p-1" />
    </div>
  );
};

export default ChatMessage;
