import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ActiveConversationSession } from '@meaku/core/types/admin/admin';
import { BrowsedUrl } from '@meaku/core/types/common';

interface ActiveConversationDetailsContextType {
  chatHistory: WebSocketMessage[];
  setChatHistory: (conversation: WebSocketMessage[]) => void;
  chatSummary: string;
  setChatSummary: (chatSummary: string) => void;
  browsedUrls: BrowsedUrl[];
  setBrowsedUrls: (browsedUrls: BrowsedUrl[]) => void;
  session: ActiveConversationSession | null;
  setSession: (session: ActiveConversationSession) => void;
}

const ActiveConversationDetailsContext = createContext<ActiveConversationDetailsContextType | undefined>(undefined);

export const ActiveConversationDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<WebSocketMessage[]>([]);
  const [chatSummary, setChatSummary] = useState<string>('');
  const [browsedUrls, setBrowsedUrls] = useState<BrowsedUrl[]>([]);
  const [session, setSession] = useState<ActiveConversationSession | null>(null);
  const handleSetChatHistoryDetails = (chatHistory: WebSocketMessage[]) => {
    setChatHistory(chatHistory);
  };

  const handleSetChatSummary = (chatSummary: string) => {
    setChatSummary(chatSummary);
  };

  const handleSetBrowsedUrls = (browsedUrls: BrowsedUrl[]) => {
    setBrowsedUrls(browsedUrls);
  };

  const handleSetSession = (session: ActiveConversationSession) => {
    setSession(session);
  };

  return (
    <ActiveConversationDetailsContext
      value={{
        chatHistory,
        chatSummary,
        setChatHistory: handleSetChatHistoryDetails,
        setChatSummary: handleSetChatSummary,
        browsedUrls,
        setBrowsedUrls: handleSetBrowsedUrls,
        session,
        setSession: handleSetSession,
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
