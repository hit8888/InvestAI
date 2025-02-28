import { useCallback, useRef } from 'react';
import apiClient from '../http/client';
import { isProduction } from '../../../../apps/agent/src/utils/common.ts';
import { ENV } from '../types/env.ts';
import { debounce } from 'lodash';
import useLocalStorageSession from './useLocalStorageSession.tsx';

interface AnalyticsEvent {
  event_name: string;
  properties: {
    timestamp: number;
    [key: string]: unknown;
  };
}

const useAnalytics = () => {
  const eventQueueRef = useRef<AnalyticsEvent[]>([]);
  const distinct_id = localStorage.getItem('distinct_id');
  const { sessionData } = useLocalStorageSession();

  const commonProperties = { environment: ENV.VITE_APP_ENV };

  const sendBatchEvents = useCallback(
    debounce(async () => {
      if (eventQueueRef.current.length === 0) return;
      if (!isProduction) return;

      try {
        await apiClient.post('/tenant/chat/api/track/batch/', {
          batch_timestamp: Date.now(),
          events: eventQueueRef.current,
        });
        // Clear the queue after successful send
        eventQueueRef.current = [];
      } catch (error) {
        console.error('Failed to send analytics events:', error);
      }
    }, 2000),
    [],
  );

  const trackEvent = (eventName: string, properties: Record<string, unknown> = {}, is_test: boolean = false) => {
    if (is_test) return;
    try {
      eventQueueRef.current.push({
        event_name: eventName,
        properties: {
          ...commonProperties,
          ...properties,
          timestamp: Date.now(),
          distinct_id,
          utmParams: sessionData.utmParams,
        },
      });
      sendBatchEvents();
    } catch (error) {
      console.error('Error queueing analytics event:', error);
    }
  };

  return { trackEvent };
};

export default useAnalytics;
