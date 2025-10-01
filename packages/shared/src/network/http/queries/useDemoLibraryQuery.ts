import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDemoLibrary } from '../api';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';
import { Demo } from '../../../features/demo-library/types';

export interface DemoLibraryConfig {
  agentId: string;
  moduleId: string;
  sessionId: string;
  prospectId: string;
  tenantName: string;
}

export interface UseDemoLibraryQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

const demoLibraryQueryKey = (config: DemoLibraryConfig) => [
  'demoLibrary',
  config.agentId,
  config.moduleId,
  config.sessionId,
  config.prospectId,
];

const useDemoLibraryQuery = (
  config: DemoLibraryConfig,
  options: UseDemoLibraryQueryOptions = {},
): UseQueryResult<Demo[]> => {
  const { settings } = useCommandBarStore();

  const query = useQuery({
    queryKey: demoLibraryQueryKey(config),
    queryFn: async (): Promise<Demo[]> => {
      const response = await getDemoLibrary(
        config.agentId,
        config.moduleId,
        config.sessionId,
        config.prospectId,
        settings.parent_url,
      );

      // Create a map of demo artifact IDs to thumbnail URLs
      const thumbnailMap = new Map<number, string>();
      response.data.demo_thumbnails?.forEach((thumbnail) => {
        thumbnailMap.set(thumbnail.entity_artifact_id, thumbnail.thumbnail_asset_url);
      });
      // Transform the API response to match our Demo interface
      const transformedDemos: Demo[] =
        response.data.demos?.map((demo) => {
          const thumbnailUrl = thumbnailMap.get(demo.id);
          return {
            id: demo.id.toString(),
            title: demo.title,
            data: demo.data,
            relevant_queries: demo.relevant_queries,
            metadata: demo.metadata,
            status: demo.status,
            asset: {
              id: demo.asset.id,
              name: demo.asset.name,
              type: demo.asset.type,
              description: demo.asset.description,
              key: demo.asset.key,
              public_url: demo.asset.public_url,
            },
            thumbnail_url: thumbnailUrl,
          };
        }) || [];

      return transformedDemos;
    },
    enabled: Boolean(
      config.agentId && config.prospectId && config.sessionId && config.moduleId && options.enabled !== false,
    ),
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: options.gcTime ?? 10 * 60 * 1000, // 10 minutes default (was cacheTime in v4)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return query;
};

export default useDemoLibraryQuery;
