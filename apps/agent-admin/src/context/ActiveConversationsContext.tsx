import React, { createContext, useEffect, useState } from 'react';
import useActiveConversationsWebSocket, { LastMessage } from '../hooks/useActiveConversationsWebSocket';
import useActiveConversationsQuery from '../queries/query/useActiveConversationsQuery';
import { BuyerIntent } from '@neuraltrade/core/types/common';
import useSound from '@neuraltrade/core/hooks/useSound';
import { useParams } from 'react-router-dom';
import useJoinConversationStore from '../stores/useJoinConversationStore';
import popupsound from '../assets/popup-sound.mp4';
import { ReadyState } from 'react-use-websocket';
import { BrowsedUrl } from '@neuraltrade/core/types/common';
import { DataSourceItem, SdrAssignment } from '@neuraltrade/core/types/admin/api';
import useWebpageScreenshotsActiveConversation from '../hooks/useWebpageScreenshotsActiveConversation';
import { CoreCompanyResponse } from '@neuraltrade/core/types/admin/admin';
import { useNewConversationNotifications } from '../hooks/useNewConversationNotifications';

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

  // Use the notification hook
  const { handleNewConversationNotification, cleanupNotifiedConversations, isAlreadyNotified } =
    useNewConversationNotifications();

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
      } else if (sessionID) {
        // Create a minimal ActiveConversation object for standalone sessions
        // JoinConversationDrawer will fetch the full session details via useSessionDetailsQuery
        const minimalConversation: ActiveConversation = {
          agent_id: 0,
          session_id: sessionID,
          last_user_message: '',
          last_message_timestamp: new Date().toISOString(),
          buyer_intent: BuyerIntent.LOW,
          is_self_assigned: false,
          prospect: {
            name: '',
            email: '',
            country: '',
            company_demographics: {
              company_name: '',
              company_revenue: '',
              employee_count: 0,
              company_logo_url: '',
              website_url: '',
            },
            parent_url: '',
            browsed_urls: [],
            sdr_assignment: {} as SdrAssignment,
          },
          session: {
            query_params: {
              utm_source: '',
            },
          },
        };
        setCurrentConversation(minimalConversation);
      }
    } else if (!sessionID) {
      // Clear currentConversation when navigating away from session page
      setCurrentConversation(null);
    }
  }, [conversations, sessionID, setCurrentConversation]);

  useEffect(() => {
    const currentSessionIds = activeConversations?.map((c) => c.session_id) ?? [];
    const liveSessionIds = Object.keys(lastMessageBySession);
    const hasNewSession = !!liveSessionIds.find((sessionId) => !currentSessionIds.includes(sessionId));

    if (hasNewSession) {
      refetchActiveConversations().then((result) => {
        play();

        // Handle notifications for new conversations
        if (result.data) {
          const newSessionIds = liveSessionIds.filter((sessionId) => !currentSessionIds.includes(sessionId));
          const newConversations = result.data.filter(
            (conv: ActiveConversation) =>
              newSessionIds.includes(conv.session_id) && !isAlreadyNotified(conv.session_id),
          );

          handleNewConversationNotification(newConversations);
        }
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

  // Clean up notified conversations when activeConversations changes
  useEffect(() => {
    if (activeConversations) {
      cleanupNotifiedConversations(activeConversations);
    }
  }, [activeConversations, cleanupNotifiedConversations]);

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
