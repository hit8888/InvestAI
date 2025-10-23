import React, { createContext, useEffect, useState } from 'react';
import useActiveConversationsWebSocket, { LastMessage } from '../hooks/useActiveConversationsWebSocket';
import useActiveConversationsQuery from '../queries/query/useActiveConversationsQuery';
import { BuyerIntent } from '@meaku/core/types/common';
import useSound from '@meaku/core/hooks/useSound';
import { useNavigate, useParams } from 'react-router-dom';
import useJoinConversationStore from '../stores/useJoinConversationStore';
import popupsound from '../assets/popup-sound.mp4';
import { ReadyState } from 'react-use-websocket';
import { BrowsedUrl } from '@meaku/core/types/common';
import { DataSourceItem, SdrAssignment } from '@meaku/core/types/admin/api';
import useWebpageScreenshotsActiveConversation from '../hooks/useWebpageScreenshotsActiveConversation';
import { CoreCompanyResponse } from '@meaku/core/types/admin/admin';

export interface ActiveConversation {
  agent_id: number;
  session_id: string;
  last_user_message: string;
  last_message_timestamp: string;
  buyer_intent: BuyerIntent;
  is_self_assigned: boolean;
  prospect: {
    name: string;
    email: string;
    country: string;
    company?: string;
    company_demographics: {
      company_name: string;
      company_revenue: string;
      employee_count: number;
      company_logo_url: string;
      website_url: string;
    };
    parent_url: string;
    browsed_urls: BrowsedUrl[];
    sdr_assignment: SdrAssignment;
    core_company?: CoreCompanyResponse;
  };
  webpage_screenshot?: DataSourceItem | undefined;
  hasUserLeft?: boolean;
  session: {
    query_params: {
      utm_source: string;
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
  const { readyState, lastMessageBySession, setLastMessageBySession, hasUserLeftBySession, cleanupExpiredSessions } =
    useActiveConversationsWebSocket();
  const { data: conversations, isLoading, refetch: refetchActiveConversations } = useActiveConversationsQuery();
  const [activeConversations, setActiveConversations] = useState<ActiveConversation[] | null>(null);
  const { sessionID } = useParams<{ sessionID: string }>();
  const { setCurrentConversation } = useJoinConversationStore();
  const navigate = useNavigate();

  const baseVolume = 0.35;
  const { play } = useSound(popupsound, baseVolume);

  const { isWebpagesScreenshotsLoading, handleWebpageScreenshotData } = useWebpageScreenshotsActiveConversation({
    conversations,
    activeConversations,
    setActiveConversations,
  });

  useEffect(() => {
    if (conversations) {
      const newConversations =
        handleWebpageScreenshotData(conversations)?.map((conv) => ({
          ...conv,
          hasUserLeft: hasUserLeftBySession[conv.session_id] || false,
        })) || [];
      setActiveConversations(newConversations);

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

      // Clean up hasUserLeftBySession for conversations that are no longer active
      const activeSessionIds = conversations.map((conv) => conv.session_id);
      cleanupExpiredSessions(activeSessionIds);
    }

    if (sessionID && conversations) {
      const currentConversation = conversations.find((c) => c.session_id === sessionID);

      if (currentConversation) {
        setCurrentConversation(currentConversation);
      } else {
        navigate('/active-conversations');
        setCurrentConversation(null);
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

          // Set hasUserLeft based on the session-specific state
          conv.hasUserLeft = hasUserLeftBySession[conv.session_id] || false;

          newConversations.push(conv);
        });

        return newConversations.sort((a, b) => {
          const aTimestamp = new Date(a.last_message_timestamp).getTime();
          const bTimestamp = new Date(b.last_message_timestamp).getTime();
          return bTimestamp - aTimestamp;
        });
      });
    }
  }, [lastMessageBySession, hasUserLeftBySession]);

  return (
    <ActiveConversationsContext.Provider
      value={{
        isLoading: isLoading || !activeConversations || isWebpagesScreenshotsLoading,
        activeConversations,
        readyState,
      }}
    >
      {children}
    </ActiveConversationsContext.Provider>
  );
};
