import { useEffect, useRef } from "react";
import MessageItem from "./message-item";

const messages = [
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
  {
    message:
      "Well, I am a smart agent and based on my intelligence I know you recently raised Series C, and are  ramping up your engineering team in Austin. Would you like to see how HackerEarth can help?",
    sender: "bot",
  },
  {
    message: "Sure, I am curious what you have",
    sender: "user",
  },
];

const ChatMessage = () => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="ui-flex-1 ui-space-y-4 ui-overflow-y-auto ui-p-4">
      {messages.map(({ message, sender }, idx) => (
        <MessageItem
          message={message}
          sender={sender as "user" | "bot"}
          key={idx}
        />
      ))}

      <div ref={endRef} className="ui-p-1" />
    </div>
  );
};

export default ChatMessage;
