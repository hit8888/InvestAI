import { useCallback, useRef } from "react";
import apiClient from "../http/client";
import { isProduction } from "../../../../apps/chatbot/src/utils/common.ts";
import { ENV } from "../../../../apps/chatbot/src/config/env.ts";
import { debounce } from "lodash";

interface AnalyticsEvent {
  event_name: string;
  properties: {
    timestamp: number;
    [key: string]: unknown;
  };
}

const useAnalytics = () => {
  const eventQueueRef = useRef<AnalyticsEvent[]>([]);

  const commonProperties = { environment: ENV.VITE_APP_ENV };

  const sendBatchEvents = useCallback(
    debounce(async () => {
      if (eventQueueRef.current.length === 0) return;
      if (!isProduction) return;

      try {
        await apiClient.post("/tenant/chat/api/track/batch/", {
          batch_timestamp: Date.now(),
          events: eventQueueRef.current,
        });
        // Clear the queue after successful send
        eventQueueRef.current = [];
      } catch (error) {
        console.error("Failed to send analytics events:", error);
      }
    }, 10000),
    []
  );

  const trackEvent = (
    eventName: string,
    properties: Record<string, unknown> = {}
  ) => {
    try {
      eventQueueRef.current.push({
        event_name: eventName,
        properties: {
          ...commonProperties,
          ...properties,
          timestamp: Date.now(),
        },
      });
      sendBatchEvents();
    } catch (error) {
      console.error("Error queueing analytics event:", error);
    }
  };

  return { trackEvent };
};

export default useAnalytics;
