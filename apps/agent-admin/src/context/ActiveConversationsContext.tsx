import React, { createContext, useEffect, useState } from 'react';
import useActiveConversationsWebSocket from '../hooks/useActiveConversationsWebSocket';
import useActiveConversations from '../queries/query/useActiveConversations';
import { BuyerIntent } from '@meaku/core/types/common';
import useSound from '@meaku/core/hooks/useSound';
import { useNavigate, useParams } from 'react-router-dom';
import useJoinConversationStore from '../stores/useJoinConversationStore';
import popupsound from '../assets/popup-sound.mp4';

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
  last_user_message?: string;
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
};

const defaultContext: ActiveConversationsContextType = {
  isLoading: false,
  activeConversations: [],
};

export const ActiveConversationsContext = createContext<ActiveConversationsContextType>(defaultContext);

export const ActiveConversationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { lastMessageBySession } = useActiveConversationsWebSocket();
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
            conv.last_user_message = lastMessageBySession[sessionId];
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
      }}
    >
      {children}
    </ActiveConversationsContext.Provider>
  );
};
