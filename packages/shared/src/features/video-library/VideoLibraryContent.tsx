import { useState, useEffect, useCallback } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { VideoLibraryIcon } from '@meaku/saral';
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
  const { watchedVideos, addWatchedVideo, isVideoWatched } = useWatchedVideos();
  const [isMainVideoPlaying, setIsMainVideoPlaying] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [wasPlayingBeforeChange, setWasPlayingBeforeChange] = useState(false);

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

  // Set first video as selected when videos load
  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].id);
    }
  }, [videos, selectedVideoId]);

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
    const wasPlaying = isMainVideoPlaying;
    setWasPlayingBeforeChange(wasPlaying);
    setSelectedVideoId(newVideoId);
  };

  const handleWatchNow = (videoId: string) => {
    handleVideoSelect(videoId);
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
              videoId={selectedVideoId}
              getVideoById={getVideoById}
              getVideoUrl={getVideoUrl}
              onPlayingStateChange={setIsMainVideoPlaying}
              isLoading={!isConfigReady || isLoading}
              wasPlaying={wasPlayingBeforeChange}
              allVideoIds={allVideoIds}
              onVideoSelect={handleVideoSelect}
              onWatchNow={handleWatchNow}
              watchedVideos={watchedVideos}
              addWatchedVideo={addWatchedVideo}
            />
          </div>

          {/* Video Recommendations Carousel */}
          <div className="flex-shrink mb-4">
            <VideoRecommendations
              videoIds={allVideoIds}
              selectedVideoId={selectedVideoId}
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
