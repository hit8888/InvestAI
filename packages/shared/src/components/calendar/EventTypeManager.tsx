import { useState } from 'react';
import { useEventTypes } from '@calcom/atoms';
import { CalendarFormData } from '@meaku/core/types/admin/api';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { EventTypeList, EventType } from './EventTypeList';
import { EventTypeSettingsView } from './EventTypeSettingsView';
import { CreateEventTypeView } from './CreateEventTypeView';

interface UpdateCalendarParams {
  calendarId: number;
  payload: Partial<CalendarFormData>;
}

type ViewState = 'list' | 'edit' | 'create';

interface EventTypeManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateCalendarMutation: UseMutationResult<AxiosResponse<any, any>, Error, UpdateCalendarParams, unknown>;
  calendarId: number | undefined;
  username: string | undefined;
}

export const EventTypeManager = ({ updateCalendarMutation, calendarId, username }: EventTypeManagerProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);

  const { data: eventTypes, refetch, isLoading } = useEventTypes(username!);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventTypeSuccess = async (eventType: any) => {
    toast.success(`${eventType.slug} created successfully`);

    if (calendarId) {
      try {
        await updateCalendarMutation.mutateAsync({
          calendarId,
          payload: {
            event_type: eventType.slug,
          },
        });
      } catch (error) {
        toast.error('Failed to update calendar with new event type');
        console.error('Calendar update error:', error);
      }
    } else {
      toast.error('Calendar ID is required');
    }

    // Refetch event types to get the updated list including the newly created one
    await refetch();

    // Navigate back to list view
    setCurrentView('list');
  };

  const handleEditEventType = (eventType: EventType) => {
    setSelectedEventType(eventType);
    setCurrentView('edit');
  };

  const handleCreateEventType = () => {
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEventType(null);
  };

  const handleRefetch = async () => {
    await refetch();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'edit':
        if (!selectedEventType) {
          setCurrentView('list');
          return null;
        }
        return (
          <EventTypeSettingsView
            eventType={selectedEventType}
            onBack={handleBackToList}
            onDeleteSuccess={handleRefetch}
            onSaveSuccess={handleRefetch}
          />
        );

      case 'create':
        return <CreateEventTypeView onBack={handleBackToList} onSuccess={handleEventTypeSuccess} />;

      case 'list':
      default:
        return (
          <EventTypeList
            eventTypes={(eventTypes as unknown as EventType[]) || []}
            onEditEventType={handleEditEventType}
            onCreateEventType={handleCreateEventType}
            isLoading={isLoading}
          />
        );
    }
  };

  return renderCurrentView();
};
