import { AxiosResponse } from 'axios';
import { getCalendars } from '@neuraltrade/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { CalendarResponse } from '@neuraltrade/core/types/admin/api';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';

const useCalendars = (options?: BreakoutQueryOptions<CalendarResponse[], string[]>) => {
  const calendarsQueryData = useQuery({
    queryKey: ['calendars'],
    queryFn: async (): Promise<CalendarResponse[]> => {
      const response: AxiosResponse<CalendarResponse[]> = await getCalendars();
      return response.data;
    },
    ...options,
  });

  return calendarsQueryData;
};

export default useCalendars;
