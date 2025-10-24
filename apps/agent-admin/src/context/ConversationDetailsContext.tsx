import {
  ConversationsTableDisplayContent,
  TransformedProspectAndCompanyDetailsContent,
} from '@meaku/core/types/admin/admin';
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { getProspectAndCompanyDetailsData } from '../utils/common';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';

interface ConversationDetailsContextType {
  conversation: ConversationsTableDisplayContent | null;
  chatHistory: WebSocketMessage[];
  feedbackData: FeedbackRequestPayload[];
  prospectAndCompanyDetails: TransformedProspectAndCompanyDetailsContent | null;
  handleSetConversationDetails: (conversation: ConversationsTableDisplayContent | null) => void;
  handleSetChatHistoryDetails: (conversation: WebSocketMessage[]) => void;
  handleSetFeedbackDetails: (feedback: FeedbackRequestPayload[]) => void;
}

const ConversationDetailsContext = createContext<ConversationDetailsContextType | undefined>(undefined);

export const ConversationDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversation, setConversation] = useState<ConversationsTableDisplayContent | null>(null);
  const [chatHistory, setChatHistory] = useState<WebSocketMessage[]>([]);
  const [feedbackData, setFeedback] = useState<FeedbackRequestPayload[]>([]);

  const handleSetConversationDetails = useCallback((details: ConversationsTableDisplayContent | null) => {
    setConversation(details);
  }, []);

  const handleSetChatHistoryDetails = useCallback((history: WebSocketMessage[]) => {
    setChatHistory(history);
  }, []);

  const handleSetFeedbackDetails = useCallback((feedback: FeedbackRequestPayload[]) => {
    setFeedback(feedback);
  }, []);

  const prospectAndCompanyDetails = useMemo(
    () => (conversation ? getProspectAndCompanyDetailsData(conversation) : null),
    [conversation],
  );

  const contextValue = useMemo(
    () => ({
      conversation,
      chatHistory,
      feedbackData,
      prospectAndCompanyDetails,
      handleSetConversationDetails,
      handleSetChatHistoryDetails,
      handleSetFeedbackDetails,
    }),
    [
      conversation,
      chatHistory,
      feedbackData,
      prospectAndCompanyDetails,
      handleSetConversationDetails,
      handleSetChatHistoryDetails,
      handleSetFeedbackDetails,
    ],
  );

  return <ConversationDetailsContext value={contextValue}>{children}</ConversationDetailsContext>;
};

export const useConversationDetails = () => {
  const context = useContext(ConversationDetailsContext);
  if (!context) {
    throw new Error('useConversationDetails must be used within a ConversationDetailsProvider');
  }
  return context;
};
