import { useCallback, useState } from 'react';
import { createBreakoutCalendar } from '@meaku/core/adminHttp/api';
import { trackError } from '@meaku/core/utils/error';

// Type definition for calendar access token data
export interface CalendarAccessTokenData {
  access_token: string;
  cal_com_user_id: string;
  cal_com_username: string;
  connected_integration_id: number;
  calendar_url: string;
  calendar_id: number;
}

// Constants
const CALENDAR_ACCESS_TOKEN_KEY = 'calendarAccessToken';

// Helper function to get token data from localStorage
const getTokenDataFromStorage = (): CalendarAccessTokenData | null => {
  try {
    const stored = localStorage.getItem(CALENDAR_ACCESS_TOKEN_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse calendar access token from localStorage', error);
    return null;
  }
};

// Helper function to save token data to localStorage
const saveTokenDataToStorage = (tokenData: CalendarAccessTokenData | null): void => {
  try {
    if (tokenData) {
      localStorage.setItem(CALENDAR_ACCESS_TOKEN_KEY, JSON.stringify(tokenData));
    } else {
      localStorage.removeItem(CALENDAR_ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to save calendar access token to localStorage', error);
  }
};

const useManagedCalendarAccessToken = () => {
  const [tokenData, setTokenData] = useState<CalendarAccessTokenData | null>(() => getTokenDataFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update token data in both state and localStorage
  const updateTokenData = useCallback((newTokenData: CalendarAccessTokenData | null) => {
    setTokenData(newTokenData);
    saveTokenDataToStorage(newTokenData);
  }, []);

  // Create initial token using createBreakoutCalendar API
  const createInitialToken = useCallback(
    async (timezone?: string): Promise<CalendarAccessTokenData | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await createBreakoutCalendar({ timezone });

        if (response.data) {
          const newTokenData: CalendarAccessTokenData = {
            ...response.data,
          };

          updateTokenData(newTokenData);
          return newTokenData;
        }

        throw new Error('No token data received from createBreakoutCalendar API');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create calendar access token';
        setError(errorMessage);

        trackError(err, {
          action: 'createInitialToken',
          component: 'useManagedCalendarAccessToken',
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [updateTokenData],
  );

  // Get valid access token (create initial or refresh existing based on token presence)
  const getValidAccessToken = useCallback(
    async (timezone?: string): Promise<string | null> => {
      if (tokenData?.access_token) {
        return tokenData.access_token;
      }
      const newToken = await createInitialToken(timezone);
      return newToken?.access_token || null;
    },
    [createInitialToken, tokenData],
  );

  return {
    // Token data
    tokenData,
    accessToken: tokenData?.access_token || null,
    calComUserId: tokenData?.cal_com_user_id || null,
    calComUsername: tokenData?.cal_com_username || null,
    calendarUrl: tokenData?.calendar_url || null,

    // State
    isLoading,
    error,

    // Actions
    getValidAccessToken,
    createInitialToken,
  };
};

export default useManagedCalendarAccessToken;
