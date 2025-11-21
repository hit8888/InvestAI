import React from "react";
import type {
  ChatMessage as ChatMessageType,
  NavigationPathItem,
} from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "USER";
  const isAgent = message.role === "AGENT";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
      data-message-id={message.id}
      data-message-role={message.role}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-white"
            : isAgent
              ? "bg-gray-100 text-gray-900"
              : "bg-gray-200 text-gray-800"
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Navigation path chips (for AGENT messages) */}
        {isAgent &&
          message.navigationPath &&
          message.navigationPath.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.navigationPath.map(
                (item: NavigationPathItem, index: number) => (
                  <div
                    key={index}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      item.type === "page"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.type === "page" && "📄"}
                    {item.type === "action" && "⚡"}
                    {item.label}
                  </div>
                ),
              )}
            </div>
          )}

        {/* Timestamp */}
        <div
          className={`mt-2 text-xs ${
            isUser ? "text-white/70" : "text-gray-500"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
