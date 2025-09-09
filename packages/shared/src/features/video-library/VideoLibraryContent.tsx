import { useState, useEffect, useCallback } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { VideoLibraryIcon } from '@meaku/saral';
import type { FeatureContentProps } from '../';
import useVideoLibraryQuery from '../../network/http/queries/useVideoLibraryQuery';
import { MainVideoPlayer } from './components/MainVideoPlayer';
import { VideoCarousel } from './components/VideoCarousel';
import { VideoLibraryShimmer } from './components/VideoLibraryShimmer';
import { VideoLibraryCTAs } from './components/VideoLibraryCTAs';
import { VideoLibraryEmptyState } from './components/VideoLibraryEmptyState';
import { VideoLibraryErrorState } from './components/VideoLibraryErrorState';
import { Video } from './types';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { trackError } from '../../utils/error';

const { ASK_AI, BOOK_MEETING } = CommandBarModuleTypeSchema.enum;

const VideoLibraryContent = ({ onClose, setActiveFeature }: FeatureContentProps) => {
  const { config } = useCommandBarStore();
  const { orb_config: orbConfig } = config.style_config;
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.VIDEO_LIBRARY);
  const bookMeetingFeatureConfig = useFeatureConfig(BOOK_MEETING);
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

  // Use React Query hook
  const { data: videos = [], isLoading, error, refetch } = useVideoLibraryQuery(videoConfig);

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

  // Get carousel video IDs (exclude currently selected video)
  const carouselVideoIds = videos.filter((video) => video.id !== selectedVideoId).map((video) => video.id);

  const renderContent = () => {
    if (isLoading) {
      return <VideoLibraryShimmer />;
    }

    if (error) {
      return <VideoLibraryErrorState onRetry={refetch} error={error} />;
    }

    if (videos.length === 0) {
      return <VideoLibraryEmptyState />;
    }

    return (
      <div className="h-full flex flex-col p-4">
        {/* Main Video */}
        <div className="flex-shrink-0 max-h-[400px] min-h-[300px] mb-4 z-50">
          <MainVideoPlayer
            videoId={selectedVideoId}
            getVideoById={getVideoById}
            getVideoUrl={getVideoUrl}
            onPlayingStateChange={setIsMainVideoPlaying}
            isLoading={isLoading}
            wasPlaying={wasPlayingBeforeChange}
            allVideoIds={carouselVideoIds}
            onVideoSelect={handleVideoSelect}
            onWatchNow={handleWatchNow}
          />
        </div>

        {/* Video Recommendations Carousel */}
        <div className="flex-shrink-0 mb-4">
          <VideoCarousel
            videoIds={carouselVideoIds}
            selectedVideoId={selectedVideoId}
            getVideoById={getVideoById}
            getVideoUrl={getVideoUrl}
            onVideoSelect={handleVideoSelect}
            onWatchNow={handleWatchNow}
            isLoading={isLoading}
            videosPerRow={4}
          />
        </div>

        {/* CTAs */}
        <VideoLibraryCTAs
          onBookMeetingClick={handleBookMeetingClick}
          onAskAIClick={handleAskAIClick}
          orbConfig={orbConfig}
          showBookMeeting={!!bookMeetingFeatureConfig}
        />
      </div>
    );
  };

  return (
    <div className="flex w-full h-full flex-col space-y-1 rounded-[20px] border border-border-dark bg-card pb-3 shadow-elevation-md">
      <FeatureHeader title="Video Library" icon={<VideoLibraryIcon className="size-5" />} onClose={onClose} ctas={[]} />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">{renderContent()}</div>
    </div>
  );
};

export default VideoLibraryContent;
