import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConversationDetailsData } from '../../admin/api';
import { AxiosResponse } from 'axios';
import { ConversationDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';

const getConversationDetailsDataKey = (
  tenantName: string,
  sessionID: string,
  sessionIDFromContext: string,
): unknown[] => ['conversation-details-data', tenantName, sessionID, sessionIDFromContext];

type ConversationDetailsDataKey = ReturnType<typeof getConversationDetailsDataKey>;

interface IProps {
  sessionID: string;
  sessionIDFromContext: string | null;
  tenantName: string;
  queryOptions: BreakoutQueryOptions<ConversationDetailsDataResponse, ConversationDetailsDataKey>;
}

const useConversationDetailsDataQuery = ({
  sessionID,
  sessionIDFromContext,
  tenantName,
  queryOptions,
}: IProps): UseQueryResult<ConversationDetailsDataResponse> => {
  const detailsQuery = useQuery({
    queryKey: getConversationDetailsDataKey(tenantName ?? '', sessionID ?? '', sessionIDFromContext ?? ''),
    queryFn: async (): Promise<ConversationDetailsDataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      if (sessionIDFromContext) {
        // Fetch data without `fetch_all`
        const response: AxiosResponse<ConversationDetailsDataResponse> =
          await getConversationDetailsData(sessionIDFromContext);
        return response.data;
      } else if (sessionID) {
        // Fetch data with `fetch_all`
        const response: AxiosResponse<ConversationDetailsDataResponse> = await getConversationDetailsData(
          sessionID,
          true,
        );
        return response.data;
      } else {
        throw new Error('Session ID is undefined');
      }
    },
    ...queryOptions,
  });

  return detailsQuery;
};

export default useConversationDetailsDataQuery;
