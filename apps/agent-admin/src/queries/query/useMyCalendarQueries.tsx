import { AxiosResponse } from 'axios';
import { getMyCalendars } from '@meaku/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { CalendarResponse } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';

const useMyCalendars = (options?: BreakoutQueryOptions<CalendarResponse[], string[]>) => {
  const myCalendarsQueryData = useQuery({
    queryKey: ['my-calendars'],
    queryFn: async (): Promise<CalendarResponse[]> => {
      const response: AxiosResponse<CalendarResponse[]> = await getMyCalendars();
      return response.data;
    },
    ...options,
  });

  return myCalendarsQueryData;
};

export default useMyCalendars;
