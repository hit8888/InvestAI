import { AxiosResponse } from 'axios';
import { getManagedCalendars } from '@neuraltrade/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { CalendarResponse } from '@neuraltrade/core/types/admin/api';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';

const useManagedCalendars = (options?: BreakoutQueryOptions<CalendarResponse[], string[]>) => {
  const managedCalendarsQueryData = useQuery({
    queryKey: ['managed-calendar'],
    queryFn: async (): Promise<CalendarResponse[]> => {
      const response: AxiosResponse<CalendarResponse[]> = await getManagedCalendars();
      return response.data;
    },
    refetchOnMount: 'always',
    ...options,
  });

  return managedCalendarsQueryData;
};

export default useManagedCalendars;
