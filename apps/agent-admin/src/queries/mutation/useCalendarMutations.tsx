import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCalendar, updateCalendar, deleteCalendar } from '@meaku/core/adminHttp/api';
import { CalendarFormData } from '@meaku/core/types/admin/api';

interface CreateCalendarParams {
  payload: CalendarFormData;
}

interface UpdateCalendarParams {
  calendarId: number;
  payload: Partial<CalendarFormData>;
}

interface DeleteCalendarParams {
  calendarId: number;
}

/**
 * Hook for creating a new calendar
 */
export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload }: CreateCalendarParams) => createCalendar(payload),
    onSuccess: () => {
      // Invalidate calendars list after successful creation
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    },
  });
};

/**
 * Hook for updating an existing calendar
 */
export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, payload }: UpdateCalendarParams) => updateCalendar(calendarId, payload),
    onSuccess: (_, { calendarId }) => {
      // Invalidate calendars list and specific calendar after successful update
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.invalidateQueries({ queryKey: ['calendar', calendarId] });
    },
  });
};

/**
 * Hook for deleting a calendar
 */
export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId }: DeleteCalendarParams) => deleteCalendar(calendarId),
    onSuccess: (_, { calendarId }) => {
      // Invalidate calendars list and remove specific calendar from cache
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      queryClient.removeQueries({ queryKey: ['calendar', calendarId] });
    },
  });
};
