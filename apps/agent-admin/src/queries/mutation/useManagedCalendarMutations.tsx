import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBreakoutCalendar } from '@neuraltrade/core/adminHttp/api';

// Type definition for calendar access token data
export interface CalendarAccessTokenData {
  access_token: string;
  cal_com_user_id: string;
  cal_com_username: string;
  connected_integration_id: number;
  calendar_url: string;
  calendar_id: number;
}

interface CreateManagedCalendarParams {
  timezone?: string;
}

/**
 * Hook for creating a new managed calendar
 * This mutation will create a calendar and invalidate relevant queries
 */
export const useCreateManagedCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timezone }: CreateManagedCalendarParams) => createBreakoutCalendar({ timezone }),
    onSuccess: () => {
      // Invalidate managed calendars list to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['managed-calendar'] });
    },
  });
};
