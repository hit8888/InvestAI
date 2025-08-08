import { useState } from 'react';
import { CalendarFormData } from '@meaku/core/types/admin/api';
import useCalendars from '../../queries/query/useCalendarsQuery';
import { useCreateCalendar, useUpdateCalendar, useDeleteCalendar } from '../../queries/mutation/useCalendarMutations';
import CalendarItem from './CalendarItem';
import CalendarForm from './CalendarForm';
import Card from '../../components/AgentManagement/Card';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import LoadingState from '../AIPromptsPage/LoadingState';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import { toast } from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
import CalendarHeader from './CalendarHeader';
import NoInfoProvidedSadFaceIcon from '@breakout/design-system/components/icons/no-info-sadface-icon';
import { Plus } from 'lucide-react';

const CalendarList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCalendarId, setEditingCalendarId] = useState<number | null>(null);

  // Queries and mutations
  const { data: calendars, isLoading, error } = useCalendars();
  const createCalendarMutation = useCreateCalendar();
  const updateCalendarMutation = useUpdateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();

  const filteredCalendars = calendars?.filter((calendar) => !calendar.is_managed || !calendar.access_token);

  const handleAddCalendar = async (data: CalendarFormData) => {
    try {
      await createCalendarMutation.mutateAsync({ payload: data });
      setShowAddForm(false);
      toast.success('Calendar added successfully');
    } catch (error) {
      trackError(error as Error, {
        action: 'Create Calendar',
        component: 'CalendarList',
        additionalData: { payload: data },
      });
      toast.error('Failed to add calendar. Please try again.');
    }
  };

  const handleEditCalendar = async (calendarId: number, updates: Partial<CalendarFormData>) => {
    try {
      await updateCalendarMutation.mutateAsync({ calendarId, payload: updates });
      setEditingCalendarId(null);
      toast.success('Calendar updated successfully');
    } catch (error) {
      trackError(error as Error, {
        action: 'Update Calendar',
        component: 'CalendarList',
        additionalData: { calendarId, updates },
      });
      toast.error('Failed to update calendar. Please try again.');
    }
  };

  const handleDeleteCalendar = async (calendarId: number) => {
    try {
      await deleteCalendarMutation.mutateAsync({ calendarId });
      toast.success('Calendar deleted successfully');
    } catch (error) {
      trackError(error as Error, {
        action: 'Delete Calendar',
        component: 'CalendarList',
        additionalData: { calendarId },
      });
      toast.error('Failed to delete calendar. Please try again.');
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleStartEdit = (calendarId: number) => {
    setEditingCalendarId(calendarId);
  };

  const handleCancelEdit = () => {
    setEditingCalendarId(null);
  };

  // Render methods for different UI states
  const renderCalendarsList = () => (
    <Card background="GRAY25" border="GRAY200" className="w-full">
      <div className="flex w-full flex-col gap-4">
        {filteredCalendars?.map((calendar) => (
          <CalendarItem
            key={calendar.id}
            calendar={calendar}
            onEdit={handleEditCalendar}
            onDelete={handleDeleteCalendar}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            isEditing={editingCalendarId === calendar.id}
            isUpdating={updateCalendarMutation.isPending}
            isDeleting={deleteCalendarMutation.isPending}
          />
        ))}
        <div className="flex w-full justify-end">
          <Button buttonStyle="rightIcon" rightIcon={<Plus />} variant="primary" onClick={() => setShowAddForm(true)}>
            Add
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderAddForm = () => (
    <Card background="GRAY25" border="GRAY200" className="w-full">
      <CalendarForm
        onSubmit={handleAddCalendar}
        onCancel={handleCancelAdd}
        isSubmitting={createCalendarMutation.isPending}
        submitButtonText="Save"
      />
    </Card>
  );

  const renderEmptyState = () => (
    <Card background="GRAY25" border="GRAY200" className="w-full gap-4">
      <div className="flex w-full items-center justify-start gap-2.5 rounded-lg border border-gray-200 bg-gray-100 p-2">
        <NoInfoProvidedSadFaceIcon className="h-4 w-4 text-gray-500" />
        <Typography textColor="textSecondary" variant="caption-12-normal">
          No calendars added yet
        </Typography>
      </div>
      <div className="flex w-full justify-end">
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          Add +
        </Button>
      </div>
    </Card>
  );

  const hasCalendars = filteredCalendars && filteredCalendars.length > 0;

  const renderMainContent = () => {
    if (hasCalendars && !showAddForm) {
      return renderCalendarsList();
    }

    if (showAddForm) {
      return renderAddForm();
    }

    return renderEmptyState();
  };

  if (isLoading) {
    return <LoadingState title="Calendars" description="Loading your calendars..." />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-col items-start gap-6 self-stretch">
      {!hasCalendars && (
        <CalendarHeader title="Add New Calendar" description="Connect a new calendar to manage your availability" />
      )}
      {renderMainContent()}
    </div>
  );
};

export default CalendarList;
