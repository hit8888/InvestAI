import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { Message } from '@meaku/core/types/agent';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConversationDetailsContextType {
  conversation: ConversationsTableDisplayContent | null;
  chatHistory: Message[] | null;
  handleSetConversationDetails: (conversation: ConversationsTableDisplayContent | null) => void;
  handleSetChatHistoryDetails: (conversation: Message[] | null) => void;
}

const ConversationDetailsContext = createContext<ConversationDetailsContextType | undefined>(undefined);

export const ConversationDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversation, setConversation] = useState<ConversationsTableDisplayContent | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[] | null>(null);

  const handleSetConversationDetails = (details: ConversationsTableDisplayContent | null) => {
    setConversation(details);
  };

  const handleSetChatHistoryDetails = (history: Message[] | null) => {
    setChatHistory(history);
  };

  return (
    <ConversationDetailsContext
      value={{
        conversation,
        chatHistory,
        handleSetConversationDetails,
        handleSetChatHistoryDetails,
      }}
    >
      {children}
    </ConversationDetailsContext>
  );
};

export const useConversationDetails = () => {
  const context = useContext(ConversationDetailsContext);
  if (!context) {
    throw new Error('useConversationDetails must be used within a ConversationDetailsProvider');
  }
  return context;
};
