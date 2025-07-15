import { AxiosResponse } from 'axios';
import { getCalendars } from '@meaku/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { CalendarResponse } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';

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
