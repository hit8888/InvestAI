import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Video } from '../../../features/video-library/types';
import { getVideoLibrary } from '../api';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';

interface VideoLibraryConfig {
  agentId: string;
  moduleId: string;
  sessionId: string;
  prospectId: string;
}

interface UseVideoLibraryQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

const videoLibraryQueryKey = (config: VideoLibraryConfig): unknown[] => [
  'video-library',
  config.agentId,
  config.moduleId,
  config.sessionId,
  config.prospectId,
];

const useVideoLibraryQuery = (
  config: VideoLibraryConfig,
  options: UseVideoLibraryQueryOptions = {},
): UseQueryResult<Video[]> => {
  const { settings } = useCommandBarStore();

  const query = useQuery({
    queryKey: videoLibraryQueryKey(config),
    queryFn: async (): Promise<Video[]> => {
      const response = await getVideoLibrary(
        config.agentId,
        config.moduleId,
        config.sessionId,
        config.prospectId,
        settings.parent_url,
      );

      // Transform the API response to match our Video interface
      const transformedVideos: Video[] =
        response.data.videos?.map((video) => ({
          id: video.id.toString(),
          title: video.title,
          data: video.data,
          relevant_queries: video.relevant_queries,
          metadata: video.metadata,
          status: video.status,
          asset: {
            id: video.asset.id,
            name: video.asset.name,
            type: video.asset.type,
            description: video.asset.description,
            key: video.asset.key,
            public_url: video.asset.public_url,
          },
        })) || [];

      return transformedVideos;
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

export default useVideoLibraryQuery;
export { videoLibraryQueryKey };
export type { VideoLibraryConfig, UseVideoLibraryQueryOptions };
