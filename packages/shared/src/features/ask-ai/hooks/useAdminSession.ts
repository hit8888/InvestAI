import { useMemo } from 'react';
import type { Message } from '../../../types/message';
import { extractMessageEventType, extractMessageEventData } from '../../../utils/message-utils';

interface AdminSessionInfo {
  name: string;
  profilePicture?: string | null;
}

interface UseAdminSessionResult {
  adminSessionInfo: AdminSessionInfo | null;
  hasActiveAdminSession: boolean;
}

export const useAdminSession = (messages: Message[] | undefined): UseAdminSessionResult => {
  return useMemo(() => {
    if (!messages || messages.length === 0) {
      return {
        adminSessionInfo: null,
        hasActiveAdminSession: false,
      };
    }

    // Find all admin session events (JOIN_SESSION and LEAVE_SESSION)
    const adminEvents = messages.filter((msg) => {
      const eventType = extractMessageEventType(msg);
      return eventType === 'JOIN_SESSION' || eventType === 'LEAVE_SESSION';
    });

    if (adminEvents.length === 0) {
      return {
        adminSessionInfo: null,
        hasActiveAdminSession: false,
      };
    }

    // Find the most recent JOIN_SESSION event to get admin info
    const joinSessionEvents = adminEvents.filter((msg) => {
      const eventType = extractMessageEventType(msg);
      return eventType === 'JOIN_SESSION';
    });

    if (joinSessionEvents.length === 0) {
      return {
        adminSessionInfo: null,
        hasActiveAdminSession: false,
      };
    }

    // Get the most recent JOIN_SESSION event for admin info
    const mostRecentJoinEvent = joinSessionEvents[joinSessionEvents.length - 1];
    const eventData = extractMessageEventData(mostRecentJoinEvent);

    if (!eventData || typeof eventData !== 'object') {
      return {
        adminSessionInfo: null,
        hasActiveAdminSession: false,
      };
    }

    // Type guard to ensure eventData has the expected structure
    const adminData = eventData as {
      first_name?: string;
      last_name?: string;
      profile_picture?: string | null;
    };

    const firstName = adminData.first_name || '';

    // Check if admin session is currently active
    const mostRecentEvent = adminEvents[adminEvents.length - 1];
    const mostRecentEventType = extractMessageEventType(mostRecentEvent);
    const isActive = mostRecentEventType === 'JOIN_SESSION';

    return {
      adminSessionInfo: {
        name: firstName || 'Agent',
        profilePicture: adminData.profile_picture,
      },
      hasActiveAdminSession: isActive,
    };
  }, [messages]);
};
