import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { ChatInterface } from '@sevak/client';

interface SevakChatWidgetProps {
  serverUrl?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const SevakChatWidget: React.FC<SevakChatWidgetProps> = ({
  serverUrl = import.meta.env.VITE_SEVAK_SERVER_URL || 'http://localhost:8080',
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-all hover:scale-110 hover:shadow-xl`}
        aria-label="Open chat assistant"
        type="button"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col ${
        isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
      } rounded-lg bg-white shadow-2xl transition-all duration-300 ease-in-out`}
    >
      {/* Header with minimize/close buttons */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-primary px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Sevak</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-white transition-colors hover:text-gray-200"
            aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
            type="button"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="p-1 text-white transition-colors hover:text-gray-200"
            aria-label="Close chat"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat Interface - only show when not minimized */}
      {!isMinimized && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatInterface
            serverUrl={serverUrl}
            placeholder="Ask me anything about the dashboard..."
            showConnectionStatus={false}
            className="h-full flex-1"
          />
        </div>
      )}
    </div>
  );
};
