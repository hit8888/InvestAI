import Cal from '@calcom/embed-react';
import { useEffect } from 'react';
import { CalendarArtifactContent } from '../../utils/artifact';
import useDelayedCallback from '@meaku/core/hooks/useDelayedCallback';
import { CalendarMessageHandler, CalComEventData } from '../../types/calendar';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: CalendarMessageHandler;
  onLoad?: () => void;
}

export const CalComCalendar = ({ calendarContent, handleSendUserMessage, onLoad }: Props) => {
  useEffect(() => {
    if (!handleSendUserMessage) return;

    const handleBookingSuccessful = (data: CalComEventData) => {
      handleSendUserMessage(data);
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

  useDelayedCallback(onLoad);

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
