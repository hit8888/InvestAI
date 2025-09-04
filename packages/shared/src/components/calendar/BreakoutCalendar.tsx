import { CalendarArtifactContent } from '../../utils/artifact';
import { CalComEventData, CalendarMessageHandler } from '../../types/calendar';
import { Booker } from '@calcom/atoms';
import useDelayedCallback from '@meaku/core/hooks/useDelayedCallback';
import { BreakoutCalcomCalendar } from './BreakoutCalcomCalendar';
import { Typography } from '@meaku/saral';

const calOauthClientId = import.meta.env.VITE_CAL_OAUTH_CLIENT_ID;
const calApiUrl = import.meta.env.VITE_CAL_API_URL;

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: CalendarMessageHandler;
  onLoad?: () => void;
  metadata?: Record<string, unknown>;
}

const BreakoutCalendar = ({ calendarContent, handleSendUserMessage, onLoad, metadata }: Props) => {
  const handleBookingSuccessful = (data: CalComEventData) => {
    handleSendUserMessage?.(data);
  };

  useDelayedCallback(onLoad);

  if (!metadata?.event_type || !metadata?.cal_com_username) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Typography variant="body">No event type or cal com username found</Typography>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <BreakoutCalcomCalendar calApiUrl={calApiUrl} calOauthClientId={calOauthClientId}>
        <Booker
          defaultFormValues={{
            name: calendarContent.prefill_data?.user_name ?? '',
            email: calendarContent.prefill_data?.user_email ?? '',
          }}
          eventSlug={metadata.event_type as string}
          username={metadata.cal_com_username as string}
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
