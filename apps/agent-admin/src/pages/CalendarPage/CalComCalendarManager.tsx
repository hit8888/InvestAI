import '@calcom/atoms/globals.min.css';
import { CalProvider } from '@calcom/atoms';
import useManagedCalendarAccessToken from '../../hooks/useManagedCalendarAccessToken';
import CalComCalendarDisplay from './CalComCalendarDisplay';
import Button from '@breakout/design-system/components/Button/index';
import { getBrowserTimezone } from './utils';
import CalendarItem from './CalendarItem';
import Card from '../../components/AgentManagement/Card';
import LoadingState from '../ControlsPage/LoadingState';
import useManagedCalendars from '../../queries/query/useManagedCalendarsQuery';

const calOauthClientId = import.meta.env.VITE_CAL_OAUTH_CLIENT_ID;
const calApiUrl = import.meta.env.VITE_CAL_API_URL;

const CalComCalendarManager = () => {
  const { accessToken, getValidAccessToken } = useManagedCalendarAccessToken();

  const handleCreateManagedCalendar = async () => {
    try {
      await getValidAccessToken(getBrowserTimezone());
    } catch (error) {
      console.error(error);
    }
  };

  const { data: managedCalendars, isLoading } = useManagedCalendars();
  const hasCalendars = managedCalendars && managedCalendars.length > 0;

  if (isLoading) {
    return <LoadingState title="Loading calendars..." description="Please wait while we load your calendars." />;
  }

  if (hasCalendars) {
    return (
      <Card background="GRAY25" border="GRAY200" className="w-full">
        <div className="flex w-full flex-col gap-4">
          {managedCalendars?.map((calendar) => (
            <CalendarItem key={calendar.id} calendar={calendar} showActions={false} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <CalProvider
      accessToken={accessToken!}
      clientId={calOauthClientId ?? ''}
      options={{
        apiUrl: calApiUrl ?? '',
      }}
    >
      {accessToken ? (
        <CalComCalendarDisplay />
      ) : (
        <CreateManagedCalendarButton handleCreateManagedCalendar={handleCreateManagedCalendar} />
      )}
    </CalProvider>
  );
};

const CreateManagedCalendarButton = ({ handleCreateManagedCalendar }: { handleCreateManagedCalendar: () => void }) => {
  return (
    <Button onClick={handleCreateManagedCalendar} variant="primary" className="w-full">
      Create Managed Calendar
    </Button>
  );
};

export default CalComCalendarManager;
