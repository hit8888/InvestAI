import '@calcom/atoms/globals.min.css';
import { CalProvider } from '@calcom/atoms';
import CalComCalendarDisplay from './CalComCalendarDisplay';
import Button from '@breakout/design-system/components/Button/index';
import { getBrowserTimezone } from './utils';
import LoadingState from '../ControlsPage/LoadingState';
import useManagedCalendars from '../../queries/query/useManagedCalendarsQuery';
import { useCreateManagedCalendar } from '../../queries/mutation/useManagedCalendarMutations';
import { useState } from 'react';
import { Loader } from 'lucide-react';

const calOauthClientId = import.meta.env.VITE_CAL_OAUTH_CLIENT_ID;
const calApiUrl = import.meta.env.VITE_CAL_API_URL;

const CalComCalendarManager = () => {
  const { data: managedCalendars, isLoading: isCalendarsLoading } = useManagedCalendars();
  const timezone = getBrowserTimezone();

  // Get mutation hook for creating calendar
  const createManagedCalendarMutation = useCreateManagedCalendar();

  // Show loading state while calendars are loading
  if (isCalendarsLoading) {
    return <LoadingState title="Loading calendars..." description="Please wait while we load your calendars." />;
  }

  // Check if we have an existing managed calendar with access token
  const existingAccessToken = managedCalendars?.[0]?.access_token;

  // If we have an access token, show the CalProvider
  if (existingAccessToken) {
    return (
      <CalProvider
        accessToken={existingAccessToken}
        clientId={calOauthClientId ?? ''}
        options={{
          apiUrl: calApiUrl ?? '',
        }}
      >
        <CalComCalendarDisplay />
      </CalProvider>
    );
  }

  // No access token available, show create button with lifted state
  return (
    <CreateManagedCalendarButton createManagedCalendarMutation={createManagedCalendarMutation} timezone={timezone} />
  );
};

interface CreateManagedCalendarButtonProps {
  createManagedCalendarMutation: ReturnType<typeof useCreateManagedCalendar>;
  timezone?: string;
}

const CreateManagedCalendarButton = ({ createManagedCalendarMutation, timezone }: CreateManagedCalendarButtonProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateManagedCalendar = async () => {
    try {
      await createManagedCalendarMutation.mutateAsync({ timezone });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      // Error is handled by the mutation's error state
    }
  };

  const isLoading = createManagedCalendarMutation.isPending;
  const error = createManagedCalendarMutation.error;

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleCreateManagedCalendar}
        variant="primary"
        className="w-full"
        disabled={isLoading || isSuccess}
      >
        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        {isSuccess ? 'Calendar Created' : isLoading ? 'Creating Calendar...' : 'Create Managed Calendar'}
      </Button>
      {error && <div className="text-destructive-1000">{JSON.stringify(error.message)}</div>}
    </div>
  );
};

export default CalComCalendarManager;
