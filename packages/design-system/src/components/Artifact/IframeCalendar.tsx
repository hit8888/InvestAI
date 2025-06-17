import { CalendarArtifactContent } from '@meaku/core/types/artifact';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useEffect, useRef } from 'react';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

export const IframeCalendar = ({ calendarContent, handleSendUserMessage }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!handleSendUserMessage) return;

    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === 'form_submit') {
        handleSendUserMessage({
          message: {
            content: '',
            event_type: AgentEventType.CALENDAR_SUBMIT,
            event_data: {
              calendar_type: calendarContent.calendar_type,
              calendar_url: calendarContent.calendar_url,
              form_data: event.data.formData,
            },
          },
          message_type: 'EVENT',
        });
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [calendarContent, handleSendUserMessage]);

  return (
    <div className="h-full w-full overflow-auto sm:min-h-[300px]">
      <iframe
        ref={iframeRef}
        src={calendarContent.calendar_url}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
        }}
      />
    </div>
  );
};
