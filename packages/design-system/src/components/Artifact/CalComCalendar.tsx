import Cal from '@calcom/embed-react';
import { CalendarArtifactContent } from '@neuraltrade/core/types/artifact';
import { useEffect } from 'react';
import useDelayedCallback from '@neuraltrade/core/hooks/useDelayedCallback';

interface Props {
  calendarContent: CalendarArtifactContent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSendUserMessage?: (data: any) => void;
  onLoad?: () => void;
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
