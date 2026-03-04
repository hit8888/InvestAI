import { AxiosResponse } from 'axios';
import { getMyCalendars } from '@neuraltrade/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { CalendarResponse } from '@neuraltrade/core/types/admin/api';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';

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
