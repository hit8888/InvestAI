import { EventScheduledEvent, InlineWidget as CalendlyWidget, useCalendlyEventListener } from 'react-calendly';
import { CalendarArtifactContent } from '@meaku/core/types/artifact';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

export const CalendlyCalendar = ({ calendarContent, handleSendUserMessage }: Props) => {
  useCalendlyEventListener({
    onEventScheduled: (e: EventScheduledEvent) => {
      if (handleSendUserMessage) {
        handleSendUserMessage({
          message: {
            content: '',
            event_type: AgentEventType.CALENDAR_SUBMIT,
            event_data: {
              calendar_type: calendarContent.calendar_type,
              calendar_url: calendarContent.calendar_url,
              form_data: e.data.payload,
            },
          },
          message_type: 'EVENT',
        });
      }
    },
  });

  return (
    <div className="h-full w-full sm:min-h-[600px]">
      <CalendlyWidget
        url={calendarContent.calendar_url}
        prefill={calendarContent.prefill_data}
        styles={{
          height: '100%',
          width: '100%',
        }}
        utm={{
          utmSource: 'Breakout',
          utmMedium: 'chat',
          utmCampaign: 'Breakout Agent',
        }}
      />
    </div>
  );
};
