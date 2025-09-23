import { CalendarArtifactContent } from '../../utils/artifact';
import { CalComEventData, CalendarMessageHandler } from '../../types/calendar';
import { Booker } from '@calcom/atoms';
import useDelayedCallback from '@meaku/core/hooks/useDelayedCallback';
import { BreakoutCalcomCalendar } from './BreakoutCalcomCalendar';
import { Typography } from '@meaku/saral';
import { ENV } from '../../constants/env';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: CalendarMessageHandler;
  onLoad?: () => void;
}

const BreakoutCalendar = ({ calendarContent, handleSendUserMessage, onLoad }: Props) => {
  const handleBookingSuccessful = (data: CalComEventData) => {
    handleSendUserMessage?.(data);
  };

  useDelayedCallback(onLoad);

  if (!calendarContent?.event_type || !calendarContent?.cal_com_username) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Typography variant="body">No event type or cal com username found</Typography>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <BreakoutCalcomCalendar calApiUrl={ENV.VITE_CAL_API_URL} calOauthClientId={ENV.VITE_CAL_OAUTH_CLIENT_ID}>
        <Booker
          defaultFormValues={{
            name: calendarContent.prefill_data?.user_name ?? '',
            email: calendarContent.prefill_data?.user_email ?? '',
          }}
          eventSlug={calendarContent.event_type as string}
          username={calendarContent.cal_com_username as string}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onCreateBookingSuccess={(data: any) => {
            handleBookingSuccessful(data.data);
          }}
        />
      </BreakoutCalcomCalendar>
    </div>
  );
};

export default BreakoutCalendar;
