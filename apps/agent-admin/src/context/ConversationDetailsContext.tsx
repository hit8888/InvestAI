import {
  ConversationsTableDisplayContent,
  TransformedProspectAndCompanyDetailsContent,
} from '@meaku/core/types/admin/admin';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProspectAndCompanyDetailsData } from '../utils/common';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';

interface ConversationDetailsContextType {
  conversation: ConversationsTableDisplayContent | null;
  chatHistory: WebSocketMessage[];
  feedbackData: FeedbackRequestPayload[];
  ProspectAndCompanyDetails: TransformedProspectAndCompanyDetailsContent | null;
  handleSetConversationDetails: (conversation: ConversationsTableDisplayContent | null) => void;
  handleSetChatHistoryDetails: (conversation: WebSocketMessage[]) => void;
  handleSetFeedbackDetails: (feedback: FeedbackRequestPayload[]) => void;
}

const ConversationDetailsContext = createContext<ConversationDetailsContextType | undefined>(undefined);

export const ConversationDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversation, setConversation] = useState<ConversationsTableDisplayContent | null>(null);
  const [chatHistory, setChatHistory] = useState<WebSocketMessage[]>([]);
  const [feedbackData, setFeedback] = useState<FeedbackRequestPayload[]>([]);

  const handleSetConversationDetails = (details: ConversationsTableDisplayContent | null) => {
    setConversation(details);
  };

  const handleSetChatHistoryDetails = (history: WebSocketMessage[]) => {
    setChatHistory(history);
  };
  const handleSetFeedbackDetails = (feedback: FeedbackRequestPayload[]) => {
    setFeedback(feedback);
  };
  const ProspectAndCompanyDetails = conversation ? getProspectAndCompanyDetailsData(conversation) : null;
  return (
    <ConversationDetailsContext
      value={{
        conversation,
        chatHistory,
        feedbackData,
        ProspectAndCompanyDetails,
        handleSetConversationDetails,
        handleSetChatHistoryDetails,
        handleSetFeedbackDetails,
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
