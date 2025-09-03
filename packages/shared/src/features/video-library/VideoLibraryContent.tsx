import { useState, useEffect, useCallback } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { VideoLibraryIcon, Icons, Button, ThreeStarInsideOrbIcon, ShiningRectangle } from '@meaku/saral';
import type { FeatureContentProps } from '../';
import useVideoLibraryQuery from '../../network/http/queries/useVideoLibraryQuery';
import { MainVideoPlayer } from './components/MainVideoPlayer';
import { VideoCarousel } from './components/VideoCarousel';
import { Video } from './types';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';

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
    moduleId: featureConfig?.id?.toString() || '', // Use empty string to disable query if featureConfig is not available
    tenantName: config.org_name || '',
    sessionId: config.session_id || '',
    prospectId: config.prospect_id || '',
  };

  // Use React Query hook
  const { data: videos = [], isLoading, error } = useVideoLibraryQuery(videoConfig);

  // Set first video as selected when videos load
  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].id);
    }
  }, [videos, selectedVideoId]);

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
    // State 1: If main video is playing -> set new video and start playing
    // State 2: If main video is paused -> just set new video (don't start playing)
    setSelectedVideoId(newVideoId);
    setWasPlayingBeforeChange(isMainVideoPlaying); // Auto-play only if current video was playing
  };

  const handleWatchNow = (newVideoId: string) => {
    // State 3: Overlay "Watch now" - always set video and start playing
    setSelectedVideoId(newVideoId);
    setWasPlayingBeforeChange(true); // Always auto-play
  };

  // Get all video IDs for the carousel (including the selected video)
  const carouselVideoIds = videos.map((video) => video.id);

  return (
    <div
      className="flex w-full flex-col space-y-1 rounded-[20px] relative border border-border-dark bg-background shadow-elevation-md"
      style={{ minHeight: 'min(100vh, 730px)' }}
    >
      <FeatureHeader
        title="Video Library"
        titleClassName="font-normal"
        icon={<VideoLibraryIcon className="h-5 w-5" />}
        onClose={onClose}
      />
      <div className="w-full flex-1 flex p-2 pt-0">
        <div className="w-full rounded-[16px] border flex flex-col">
          <div className="relative flex-1 overflow-hidden">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Icons.Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Failed to load videos</p>
                </div>
              </div>
            ) : isLoading || videos.length > 0 ? (
              <div className="h-full flex flex-col p-4">
                {/* Main Video */}
                <div className="flex-1 min-h-0">
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
                <div className="flex-shrink-0 mb-6">
                  <VideoCarousel
                    videoIds={carouselVideoIds}
                    selectedVideoId={selectedVideoId}
                    getVideoById={getVideoById}
                    getVideoUrl={getVideoUrl}
                    onVideoSelect={handleVideoSelect}
                    onWatchNow={handleWatchNow}
                    isLoading={isLoading}
                  />
                </div>

                {/* CTAs */}
                <div className="flex gap-3 px-1 flex-shrink-0">
                  {bookMeetingFeatureConfig && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full flex !font-normal items-center justify-center gap-2"
                      onClick={handleBookMeetingClick}
                    >
                      <Icons.Calendar className="h-4 w-4" />
                      Book a Demo
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full !font-normal text-muted-foreground flex items-center justify-center gap-2"
                    onClick={handleAskAIClick}
                  >
                    Have Questions?
                    <span className="text-primary flex items-center gap-1">
                      Try Ask AI
                      {!orbConfig?.show_orb ? (
                        <img
                          src={orbConfig?.logo_url ?? undefined}
                          alt="Ask AI"
                          className="h-4 w-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="relative h-4 w-4 overflow-hidden">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/10 to-transparent blur-sm" />
                          <div className="relative inset-0 z-10 flex flex-col items-center justify-center">
                            <ShiningRectangle width={8} height={4} />
                            <div className="relative -top-0.5">
                              <ThreeStarInsideOrbIcon width={10} height={8} />
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Icons.Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No videos available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLibraryContent;
