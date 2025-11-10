import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getWebpageScreenshots } from '@meaku/core/adminHttp/api';
import { WebpagesScreenshotsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

const getWebpagesScreenshotsDataKey = (tenantName: string, urls: string[]): unknown[] => [
  'webpages-screenshots-data',
  tenantName,
  urls,
];

type WebpagesScreenshotsDataKey = ReturnType<typeof getWebpagesScreenshotsDataKey>;

type WebpagesScreenshotsDataQueryPayload = {
  urls: string[];
};

type WebpagesScreenshotsDataQueryOptions = BreakoutQueryOptions<
  WebpagesScreenshotsDataResponse,
  WebpagesScreenshotsDataKey
>;

const useWebpagesScreenshotsQuery = (
  payload: WebpagesScreenshotsDataQueryPayload,
  options: WebpagesScreenshotsDataQueryOptions = {},
): UseQueryResult<WebpagesScreenshotsDataResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';

  const webpagesScreenshotsDataQuery = useQuery({
    queryKey: getWebpagesScreenshotsDataKey(tenantName ?? '', payload.urls),
    queryFn: async () => {
      const response = await getWebpageScreenshots(payload);
      return response.data;
    },
    ...options,
  });

  return webpagesScreenshotsDataQuery;
};

export default useWebpagesScreenshotsQuery;
