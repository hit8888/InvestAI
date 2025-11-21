import { useState } from 'react';
import { useCreateManagedCalendar } from '../../queries/mutation/useManagedCalendarMutations';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import Button from '@breakout/design-system/components/Button/index';
import { getBrowserTimezone } from './utils';
import { trackError } from '@meaku/core/utils/error';

const CreateManagedCalendarButton = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const timezone = getBrowserTimezone();

  // Get mutation hook for creating calendar
  const createManagedCalendarMutation = useCreateManagedCalendar();

  const handleCreateManagedCalendar = async () => {
    try {
      await createManagedCalendarMutation.mutateAsync({ timezone });
      setIsSuccess(true);
    } catch (error) {
      trackError(error as Error, {
        action: 'Create Managed Calendar',
        component: 'CreateManagedCalendarButton',
      });
      toast.error('Failed to create managed calendar');
    }
  };

  const isLoading = createManagedCalendarMutation.isPending;

  return (
    <div className="flex flex-col gap-4">
      <Button
        id="calendar-create-managed-calendar-button"
        onClick={handleCreateManagedCalendar}
        variant="primary"
        className="w-full"
        disabled={isLoading || isSuccess}
      >
        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        {isSuccess ? 'Calendar Created' : isLoading ? 'Creating Calendar...' : 'Create Managed Calendar'}
      </Button>
    </div>
  );
};

export default CreateManagedCalendarButton;
