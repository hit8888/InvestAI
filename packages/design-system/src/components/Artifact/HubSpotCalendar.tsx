import { CalendarArtifactContent } from '@meaku/core/types/artifact';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useEffect, useRef } from 'react';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  onLoad?: () => void;
}

export const HubSpotCalendar = ({ calendarContent, handleSendUserMessage, onLoad }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  // Build URL with prefill data as query parameters
  const buildMeetingUrl = () => {
    if (!calendarContent.calendar_url) return '';

    const baseUrl = calendarContent.calendar_url;
    const prefillData = calendarContent.prefill_data;

    if (!prefillData || Object.keys(prefillData).length === 0) {
      return baseUrl;
    }

    const urlObj = new URL(baseUrl);

    // Add prefill data as query parameters
    for (const key in prefillData) {
      if (Object.prototype.hasOwnProperty.call(prefillData, key)) {
        const value = prefillData[key];
        if (value !== null && value !== undefined && value !== '') {
          urlObj.searchParams.set(key, String(value));
        }
      }
    }

    return urlObj.toString();
  };

  const meetingUrlWithPrefill = buildMeetingUrl();

  useEffect(() => {
    // Listen for HubSpot meeting booking events
    const handleHubSpotMessage = (event: MessageEvent) => {
      if (event.data?.meetingBookSucceeded === true && !!event.data?.meetingsPayload) {
        if (handleSendUserMessage) {
          handleSendUserMessage({
            message: {
              content: '',
              event_type: AgentEventType.CALENDAR_SUBMIT,
              event_data: {
                calendar_type: calendarContent.calendar_type,
                calendar_url: calendarContent.calendar_url,
                form_data: event.data.meetingsPayload,
              },
            },
            message_type: 'EVENT',
          });
        }
      }
    };

    window.addEventListener('message', handleHubSpotMessage);

    // Load HubSpot meetings embed script if not already loaded
    const loadHubSpotScript = () => {
      if (scriptLoadedRef.current) return;

      const existingScript = document.querySelector('script[src*="MeetingsEmbedCode.js"]');
      if (existingScript) {
        scriptLoadedRef.current = true;
        // Apply iframe height styles if script already exists
        applyIframeStyles();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        console.log('HubSpot meetings script loaded');
        // Apply iframe height styles after script loads
        setTimeout(applyIframeStyles, 100);
      };
      script.onerror = () => {
        console.error('Failed to load HubSpot meetings script');
      };

      document.head.appendChild(script);
    };

    // Function to apply custom height styles to the HubSpot iframe
    const applyIframeStyles = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const iframe = element.querySelector('iframe') || (element.tagName === 'IFRAME' ? element : null);
              if (iframe) {
                (iframe as HTMLIFrameElement).style.height = '90%'; // Adjust this value as needed
                (iframe as HTMLIFrameElement).style.minHeight = '540px';
                observer.disconnect(); // Stop observing once we've found and styled the iframe
                // Call onLoad when iframe is ready
                setTimeout(() => onLoad?.(), 500);
              }
            }
          });
        });
      });

      if (containerRef.current) {
        observer.observe(containerRef.current, {
          childList: true,
          subtree: true,
        });

        // Also check if iframe already exists
        const existingIframe = containerRef.current.querySelector('iframe');
        if (existingIframe) {
          (existingIframe as HTMLIFrameElement).style.height = '90%';
          (existingIframe as HTMLIFrameElement).style.minHeight = '540px';
          observer.disconnect();
          // Call onLoad when iframe is ready
          setTimeout(() => onLoad?.(), 500);
        }
      }

      // Cleanup observer after 5 seconds to avoid memory leaks
      setTimeout(() => observer.disconnect(), 5000);
    };

    loadHubSpotScript();

    return () => {
      window.removeEventListener('message', handleHubSpotMessage);
    };
  }, [calendarContent.calendar_url, calendarContent, handleSendUserMessage]);

  if (!calendarContent.calendar_url) {
    return (
      <div className="flex h-full w-full items-center justify-center sm:min-h-[600px]">
        <div className="text-center">
          <p className="text-gray-600">Invalid HubSpot meeting URL</p>
          <p className="mt-2 text-sm text-gray-400">
            Please provide a valid HubSpot meeting URL in calendar_url or prefill_data.meetingUrl
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full sm:min-h-[600px]">
      <style>{`
        .meetings-iframe-container iframe {
          height: 100% !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="meetings-iframe-container h-full w-full"
        data-src={meetingUrlWithPrefill}
        style={{ minHeight: '600px', height: '90%' }}
      />
    </div>
  );
};
