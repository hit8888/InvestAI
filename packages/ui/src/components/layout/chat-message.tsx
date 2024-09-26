import { Message } from "@meaku/core/types/chat";
import { useEffect, useRef } from "react";
import MessageItem from "./message-item";
import SuggestedQuestion from "./suggested-question";

type Props = {
  messages: Message[];
  suggestedQuestions: string[];
  handleSuggestedQuestionOnClick: (question: string) => void;
};

const ChatMessage = (props: Props) => {
  const { messages, suggestedQuestions, handleSuggestedQuestionOnClick } =
    props;

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[messages.length - 1]?.message]);

  return (
    <div className="ui-flex-1 ui-space-y-4 ui-overflow-y-auto ui-p-4">
      {messages.map((message) => (
        <MessageItem message={message} key={message.id} />
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
