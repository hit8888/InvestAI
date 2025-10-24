import { useState, useEffect, useCallback } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { Markdown, VideoLibraryIcon } from '@meaku/saral';
import type { FeatureContentProps } from '../';
import useVideoLibraryQuery from '../../network/http/queries/useVideoLibraryQuery';
import { MainVideoPlayer } from './components/MainVideoPlayer';
// import { VideoCarousel } from './components/VideoCarousel';
import { VideoRecommendations } from './components/VideoRecommendations';
import { VideoLibraryCTAs } from './components/VideoLibraryCTAs';
import { VideoLibraryEmptyState } from './components/VideoLibraryEmptyState';
import { VideoLibraryErrorState } from './components/VideoLibraryErrorState';
import { Video } from './types';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { trackError } from '../../utils/error';
import { useWatchedVideos } from './hooks/useWatchedVideos';

const { ASK_AI, BOOK_MEETING } = CommandBarModuleTypeSchema.enum;

const VideoLibraryContent = ({ onClose, setActiveFeature }: FeatureContentProps) => {
  const { config } = useCommandBarStore();
  const { orb_config: orbConfig } = config.style_config;
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.VIDEO_LIBRARY);
  const bookMeetingFeatureConfig = useFeatureConfig(BOOK_MEETING);
  const { addWatchedVideo, isVideoWatched } = useWatchedVideos();
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Create video config for React Query
  const videoConfig = {
    agentId: config.agent_id?.toString() || '',
    moduleId: featureConfig?.id?.toString() || '',
    tenantName: config.org_name || '',
    sessionId: config.session_id || '',
    prospectId: config.prospect_id || '',
  };

  // Check if config is ready for the query
  const isConfigReady = Boolean(config.agent_id && featureConfig?.id && config.session_id && config.prospect_id);

  // Use React Query hook
  const {
    data: videos = [],
    isLoading,
    error,
    refetch,
  } = useVideoLibraryQuery(videoConfig, {
    enabled: isConfigReady,
  });

  // Select first unwatched video when videos are loaded
  useEffect(() => {
    if (videos.length > 0 && !currentVideoId) {
      // Try to find first unwatched video
      const firstUnwatchedVideo = videos.find((video) => !isVideoWatched(video.id));
      // If all videos are watched, select the first video
      const videoToSelect = firstUnwatchedVideo?.id || videos[0].id;
      setCurrentVideoId(videoToSelect);
    }
  }, [videos, currentVideoId, isVideoWatched]);

  // Track errors when they occur
  useEffect(() => {
    if (error) {
      trackError(error, {
        component: 'VideoLibraryContent',
        action: 'useVideoLibraryQuery',
        sessionId: config.session_id,
        additionalData: {
          agentId: config.agent_id,
          moduleId: featureConfig?.id,
          tenantName: config.org_name,
          prospectId: config.prospect_id,
        },
      });
    }
  }, [error, config.session_id, config.agent_id, featureConfig?.id, config.org_name, config.prospect_id]);

  // Helper functions - memoized to prevent unnecessary re-renders
  const getVideoById = useCallback(
    (id: string): Video | undefined => {
      return videos.find((video) => video.id === id);
    },
    [videos],
  );

  const getVideoUrl = useCallback((video: Video): string => {
    return video.asset.public_url;
  }, []);

  const handleAskAIClick = () => {
    setActiveFeature?.(ASK_AI);
  };

  const handleBookMeetingClick = () => {
    setActiveFeature?.(BOOK_MEETING);
  };

  const handleVideoSelect = (newVideoId: string) => {
    setCurrentVideoId(newVideoId);
    setShowRecommendation(false);
    // Mark current video as watched when user selects a new one
    if (currentVideoId) {
      addWatchedVideo(currentVideoId);
    }
  };

  const handleVideoEnd = () => {
    // Mark current video as watched when it ends
    if (currentVideoId) {
      addWatchedVideo(currentVideoId);
    }
    setShowRecommendation(true);
  };

  const handleLater = () => {
    setShowRecommendation(false);
  };

  // Get all video IDs for carousel (include all videos)
  const allVideoIds = videos.map((video) => video.id);

  const renderContent = () => {
    if (error) {
      return <VideoLibraryErrorState onRetry={refetch} error={error} />;
    }

    if (videos.length === 0 && isConfigReady && !isLoading) {
      return <VideoLibraryEmptyState />;
    }

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {/* Main Video */}
          <div className="flex-shrink-0 mb-4 z-50 h-auto">
            <MainVideoPlayer
              videoId={currentVideoId}
              getVideoById={getVideoById}
              getVideoUrl={getVideoUrl}
              isLoading={!isConfigReady || isLoading}
              onVideoEnd={handleVideoEnd}
              onVideoSelect={handleVideoSelect}
              showRecommendation={showRecommendation}
              allVideoIds={allVideoIds}
              onWatchNow={handleVideoSelect}
              onLater={handleLater}
              getNextRecommendedVideo={() => {
                if (!currentVideoId || allVideoIds.length === 0) return null;
                const currentIndex = allVideoIds.indexOf(currentVideoId);
                const searchOrder = [...allVideoIds.slice(currentIndex + 1), ...allVideoIds.slice(0, currentIndex)];
                const nextUnwatchedId = searchOrder.find((id) => !isVideoWatched(id) && id !== currentVideoId);
                if (nextUnwatchedId) {
                  return getVideoById(nextUnwatchedId) || null;
                }
                const nextIndex = (currentIndex + 1) % allVideoIds.length;
                const nextVideoId = allVideoIds[nextIndex];
                return getVideoById(nextVideoId) || null;
              }}
            />
          </div>

          {/* Video Recommendations Carousel */}
          <div className="flex-shrink mb-4">
            <VideoRecommendations
              videoIds={allVideoIds}
              selectedVideoId={currentVideoId}
              getVideoById={getVideoById}
              getVideoUrl={getVideoUrl}
              onVideoSelect={handleVideoSelect}
              isLoading={!isConfigReady || isLoading}
              isVideoWatched={isVideoWatched}
            />
          </div>
        </div>
      </div>
    );
  };

  const description = featureConfig?.description ?? '';

  return (
    <div className="flex w-full h-full flex-col rounded-[20px] border border-border-dark bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background">
        <FeatureHeader
          title="Video Library"
          icon={<VideoLibraryIcon className="size-5" />}
          onClose={onClose}
          ctas={[]}
        />
      </div>

      {description.length > 0 && (
        <div className="w-full flex flex-col items-start justify-start px-4 text-gray-500">
          <Markdown markdown={description} />
        </div>
      )}

      {/* Scrollable Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="p-4">{renderContent()}</div>
      </div>

      {/* Sticky CTAs at bottom - outside scrollable area */}
      <div className="sticky bottom-0 p-4 pt-4 border-t border-border-dark/20 bg-background z-10">
        <VideoLibraryCTAs
          onBookMeetingClick={handleBookMeetingClick}
          onAskAIClick={handleAskAIClick}
          orbConfig={orbConfig}
          showBookMeeting={!!bookMeetingFeatureConfig}
          isLoading={!isConfigReady || isLoading}
        />
      </div>
    </div>
  );
};

export default VideoLibraryContent;
