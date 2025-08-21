import { AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';

import { getBookMeetingForm } from '../api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { FormConfigResponse } from '../../../types/responses';

const bookMeetingFormQueryKey = (prospectId: string): unknown[] => ['get-book-meeting-form', prospectId];

type BookMeetingFormQueryKey = ReturnType<typeof bookMeetingFormQueryKey>;

type BookMeetingFormQueryPayload = {
  agentId: string;
  prospectId?: string;
};

const useBookMeetingFormQuery = (
  payload: BookMeetingFormQueryPayload,
  options: BreakoutQueryOptions<FormConfigResponse, BookMeetingFormQueryKey> = {},
) => {
  const { agentId, prospectId } = payload;

  const bookMeetingFormQueryData = useQuery({
    queryKey: bookMeetingFormQueryKey(prospectId ?? ''),
    queryFn: async (): Promise<FormConfigResponse> => {
      const response: AxiosResponse<FormConfigResponse> = await getBookMeetingForm(agentId, prospectId);

      return response.data;
    },
    ...options,
  });

  return bookMeetingFormQueryData;
};

export default useBookMeetingFormQuery;
