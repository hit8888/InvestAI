import React, { useRef, useEffect, useState } from "react";
import { useSevakChat } from "../hooks/useSevakChat";
import { ChatMessage } from "./ChatMessage";
import type { SevakClientConfig, RouteStep } from "../types";

export interface ChatInterfaceProps extends SevakClientConfig {
  className?: string;
  placeholder?: string;
  showConnectionStatus?: boolean;
  navigate?: (path: string, options?: { state?: unknown }) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className = "",
  placeholder = "Ask me anything about the dashboard...",
  showConnectionStatus = true,
  navigate,
  ...config
}) => {
  const {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  } = useSevakChat(config);
  const [inputValue, setInputValue] = useState("");
  const [completedRouteIndices, setCompletedRouteIndices] = useState<number[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (_routes: RouteStep[]) => {
    // Start navigation - don't disable chat, just track it
    setCompletedRouteIndices([]);
  };

  // Listen for route completion updates from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("sevakCompletedRoutes");
      if (stored) {
        try {
          const indices = JSON.parse(stored) as number[];
          setCompletedRouteIndices(indices);
        } catch {
          // Ignore parse errors
        }
      }
    };

    // Check initial value
    handleStorageChange();

    // Listen for changes
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically in case same-tab updates
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && isConnected && !isLoading) {
      sendMessage(inputValue);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Header - optional, can be hidden when used in widget */}
      {showConnectionStatus && (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-gray-500 hover:text-gray-700"
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      )}

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">👋 Welcome!</p>
              <p className="text-sm">
                Ask me anything about the dashboard, and I'll help you navigate.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                onNavigate={handleNavigate}
                isNavigationDisabled={false}
                navigate={navigate}
                completedRouteIndices={completedRouteIndices}
                isLastMessage={index === messages.length - 1 && !isLoading}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!isConnected || isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !isConnected || isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
