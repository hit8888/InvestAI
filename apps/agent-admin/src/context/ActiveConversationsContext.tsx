import React, { createContext, useEffect, useState } from 'react';
import useActiveConversationsWebSocket, { LastMessage } from '../hooks/useActiveConversationsWebSocket';
import useActiveConversations from '../queries/query/useActiveConversations';
import { BuyerIntent } from '@meaku/core/types/common';
import useSound from '@meaku/core/hooks/useSound';
import { useNavigate, useParams } from 'react-router-dom';
import useJoinConversationStore from '../stores/useJoinConversationStore';
import popupsound from '../assets/popup-sound.mp4';
import { ReadyState } from 'react-use-websocket';

export type ActiveConversationCard = {
  sessionId: string;
  companyLogoUrl: string;
  companyName: string;
  userName: string;
  location: {
    city: string;
    country: string;
  };
  duration: string;
  messageCount: number;
  lastInput: string;
  timePassedAfterInactive: string;
  isTyping: boolean;
  isActive: boolean;
  buyerIntentLabel: string;
};

export interface ActiveConversation {
  agent_id: number;
  session_id: string;
  last_user_message: string;
  last_message_timestamp: string;
  buyer_intent: BuyerIntent;
  prospect: {
    name: string;
    email: string;
    country: string;
    company?: string;
    company_demographics: {
      company_revenue: string;
      employee_count: number;
      company_logo_url: string;
      website_url: string;
    };
  };
}

type ActiveConversationsContextType = {
  isLoading: boolean;
  activeConversations: ActiveConversation[] | null;
  readyState: ReadyState;
};

const defaultContext: ActiveConversationsContextType = {
  isLoading: false,
  activeConversations: [],
  readyState: WebSocket.CLOSED,
};

export const ActiveConversationsContext = createContext<ActiveConversationsContextType>(defaultContext);

export const ActiveConversationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { readyState, lastMessageBySession, setLastMessageBySession } = useActiveConversationsWebSocket();
  const { data: conversations, isLoading, refetch: refetchActiveConversations } = useActiveConversations();
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[] | null>(null);
  const { sessionID } = useParams<{ sessionID: string }>();
  const { setCurrentConversation } = useJoinConversationStore();
  const navigate = useNavigate();

  const baseVolume = 0.35;
  const { play } = useSound(popupsound, baseVolume);

  useEffect(() => {
    if (conversations) {
      setActiveConversations(conversations);

      const lastMessagesBySession = conversations.reduce(
        (acc, conv) => {
          if (conv.last_user_message) {
            acc[conv.session_id] = {
              message: conv.last_user_message,
              timestamp: conv.last_message_timestamp,
            };
          }
          return acc;
        },
        {} as Record<string, LastMessage>,
      );

      setLastMessageBySession(lastMessagesBySession);
    }

    if (sessionID && conversations) {
      const currentConversation = conversations.find((c) => c.session_id === sessionID);

      if (currentConversation) {
        setCurrentConversation(currentConversation);
      } else {
        navigate('/conversations');
      }
    }
  }, [conversations, sessionID, setCurrentConversation]);

  useEffect(() => {
    const currentSessionIds = activeConversations?.map((c) => c.session_id) ?? [];
    const liveSessionIds = Object.keys(lastMessageBySession);
    const hasNewSession = !!liveSessionIds.find((sessionId) => !currentSessionIds.includes(sessionId));

    if (hasNewSession) {
      refetchActiveConversations().then(() => {
        play();
      });
    } else {
      setActiveConversations((conversations) => {
        const newConversations: ActiveConversation[] = [];
        conversations?.forEach((conv) => {
          const sessionId = liveSessionIds?.find((sessionId) => conv.session_id === sessionId);

          if (sessionId) {
            conv.last_user_message = lastMessageBySession[sessionId].message;
            conv.last_message_timestamp = lastMessageBySession[sessionId].timestamp;
          }

          newConversations.push(conv);
        });

        return newConversations;
      });
    }
  }, [lastMessageBySession]);

  return (
    <ActiveConversationsContext.Provider
      value={{
        isLoading: isLoading || !activeConversations,
        activeConversations,
        readyState,
      }}
    >
      {children}
    </ActiveConversationsContext.Provider>
  );
};
