import CreateManagedCalendarButton from './CreateManagedCalendarButton';
import { BreakoutCalcomCalendar } from '@meaku/shared/components/calendar';
import CalComCalendarDisplay from './CalComCalendarDisplay';
import useManagedCalendars from '../../queries/query/useManagedCalendarsQuery';
import LoadingState from '../ControlsPage/LoadingState';

const calOauthClientId = import.meta.env.VITE_CAL_OAUTH_CLIENT_ID;
const calApiUrl = import.meta.env.VITE_CAL_API_URL;

const CalComCalendarManager = () => {
  const { data: managedCalendars, isLoading: isCalendarsLoading } = useManagedCalendars();

  // Show loading state while calendars are loading
  if (isCalendarsLoading) {
    return <LoadingState title="Loading calendars..." description="Please wait while we load your calendars." />;
  }

  const {
    metadata: calendarMetadata,
    access_token: accessToken,
    calendar_type: calendarType,
    id: calendarId,
  } = managedCalendars?.[0] ?? {};
  const username = calendarMetadata?.cal_com_username;

  // If we have an access token, show the CalProvider
  if (accessToken && calendarType === 'BREAKOUT') {
    return (
      <BreakoutCalcomCalendar accessToken={accessToken} calOauthClientId={calOauthClientId} calApiUrl={calApiUrl}>
        <CalComCalendarDisplay calendarId={calendarId} username={username} />
      </BreakoutCalcomCalendar>
    );
  }

  // No access token available, show create button with lifted state
  return <CreateManagedCalendarButton />;
};

export default CalComCalendarManager;
