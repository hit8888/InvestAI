import { useState } from 'react';
import { CalendarFormData } from '@meaku/core/types/admin/api';
import useCalendars from '../../queries/query/useCalendarsQuery';
import { useCreateCalendar, useUpdateCalendar, useDeleteCalendar } from '../../queries/mutation/useCalendarMutations';
import CalendarItem from './CalendarItem';
import CalendarForm from './CalendarForm';
import Card from '../../components/AgentManagement/Card';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import LoadingState from '../ControlsPage/LoadingState';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import { toast } from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
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
    <Card background="GRAY25" border="GRAY200" className="flex w-full flex-row items-center justify-between p-4">
      <Typography variant="body-14" textColor="gray500">
        Add a new calendar to manage your availability
      </Typography>
      <Button variant="primary" onClick={() => setShowAddForm(true)}>
        Add Calendar
      </Button>
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
  };

  if (isLoading) {
    return <LoadingState title="Calendars" description="Loading your calendars..." />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-col items-start gap-6 self-stretch">
      {!hasCalendars && !showAddForm && renderEmptyState()}
      {renderMainContent()}
    </div>
  );
};

export default CalendarList;
