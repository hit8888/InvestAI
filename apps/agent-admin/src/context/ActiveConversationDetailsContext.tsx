import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

interface ActiveConversationDetailsContextType {
  chatHistory: WebSocketMessage[];
  setChatHistory: (conversation: WebSocketMessage[]) => void;
  chatSummary: string;
  setChatSummary: (chatSummary: string) => void;
}

const ActiveConversationDetailsContext = createContext<ActiveConversationDetailsContextType | undefined>(undefined);

export const ActiveConversationDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<WebSocketMessage[]>([]);
  const [chatSummary, setChatSummary] = useState<string>('');

  const handleSetChatHistoryDetails = (chatHistory: WebSocketMessage[]) => {
    setChatHistory(chatHistory);
  };

  const handleSetChatSummary = (chatSummary: string) => {
    setChatSummary(chatSummary);
  };

  return (
    <ActiveConversationDetailsContext
      value={{
        chatHistory,
        chatSummary,
        setChatHistory: handleSetChatHistoryDetails,
        setChatSummary: handleSetChatSummary,
      }}
    >
      {children}
    </ActiveConversationDetailsContext>
  );
};

export const useActiveConversationDetails = () => {
  const context = useContext(ActiveConversationDetailsContext);
  if (!context) {
    throw new Error('useActiveConversationDetails must be used within a ConversationDetailsProvider');
  }
  return context;
};
