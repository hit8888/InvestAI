import Cal from '@calcom/embed-react';
import { CalendarArtifactContent } from '@meaku/core/types/artifact';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useEffect } from 'react';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

interface CalComEventData {
  uid: string | undefined;
  title: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  eventTypeId: number | null | undefined;
  status: string | undefined;
  paymentRequired: boolean;
  isRecurring: boolean;
  allBookings?: {
    startTime: string;
    endTime: string;
  }[];
}

export const CalComCalendar = ({ calendarContent, handleSendUserMessage }: Props) => {
  useEffect(() => {
    if (!handleSendUserMessage) return;

    const handleBookingSuccessful = (data: CalComEventData) => {
      handleSendUserMessage({
        message: {
          content: '',
          event_type: AgentEventType.CALENDAR_SUBMIT,
          event_data: {
            calendar_type: calendarContent.calendar_type,
            calendar_url: calendarContent.calendar_url,
            form_data: data,
          },
        },
        message_type: 'EVENT',
      });
    };

    // Listen for successful bookings
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'bookingSuccessfulV2') {
        handleBookingSuccessful(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [calendarContent, handleSendUserMessage]);

  return (
    <div className="h-full w-full sm:min-h-[600px]">
      <Cal
        calLink={calendarContent.calendar_url}
        config={{ theme: 'light', ...calendarContent.prefill_data }}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
        }}
      />
    </div>
  );
};
