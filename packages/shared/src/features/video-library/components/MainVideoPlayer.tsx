import { Video } from '../types';
import { useRef, useState, useEffect } from 'react';
import { VideoThumbnail } from './VideoThumbnail';
import { useWatchedVideos } from '../hooks/useWatchedVideos';

interface MainVideoPlayerProps {
  videoId: string | null;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  onPlayingStateChange?: (isPlaying: boolean) => void;
  isLoading?: boolean;
  wasPlaying?: boolean;
  allVideoIds?: string[];
  onVideoSelect?: (videoId: string) => void;
  onWatchNow?: (videoId: string) => void;
}

export const MainVideoPlayer = ({
  videoId,
  getVideoById,
  getVideoUrl,
  onPlayingStateChange,
  isLoading = false,
  wasPlaying = false,
  allVideoIds = [],
  onVideoSelect,
  onWatchNow,
}: MainVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasEnded, setHasEnded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { getWatchedVideos, addWatchedVideo } = useWatchedVideos();

  const video = videoId ? getVideoById(videoId) : null;

  // Use direct video URL for progressive buffering (no full caching)
  const videoUrl = video ? getVideoUrl(video) : null;

  // Find next recommended video
  const getNextRecommendedVideo = (): Video | null => {
    if (!videoId || allVideoIds.length === 0) return null;

    const watchedVideos = getWatchedVideos();
    // First, try to find an unplayed video
    const unplayedVideoId = allVideoIds.find((id) => !watchedVideos.has(id) && id !== videoId);
    if (unplayedVideoId) {
      return getVideoById(unplayedVideoId) || null;
    }

    // If all videos are played, get the next video in sequence
    const currentIndex = allVideoIds.indexOf(videoId);
    const nextIndex = (currentIndex + 1) % allVideoIds.length;
    const nextVideoId = allVideoIds[nextIndex];

    return getVideoById(nextVideoId) || null;
  };

  const nextRecommendedVideo = getNextRecommendedVideo();
  // Reset ended state when video changes
  useEffect(() => {
    setHasEnded(false);
    setShowOverlay(false);
    onPlayingStateChange?.(false);
  }, [videoId, onPlayingStateChange]);

  // Auto-play new video if the previous one was playing
  useEffect(() => {
    if (videoRef.current && videoUrl && wasPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Auto-play failed:', error);
        });
      }
    }
  }, [videoUrl, wasPlaying]);

  // Trigger fade-in animation when video ends
  useEffect(() => {
    if (hasEnded && nextRecommendedVideo) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasEnded, nextRecommendedVideo]);

  const handlePlay = () => {
    setHasEnded(false);
    onPlayingStateChange?.(true);
  };

  const handlePause = () => {
    onPlayingStateChange?.(false);
  };

  const handleEnded = () => {
    setHasEnded(true);
    onPlayingStateChange?.(false);

    // Mark current video as watched
    if (videoId) {
      addWatchedVideo(videoId);
    }
  };

  const handleNextVideoClick = () => {
    if (nextRecommendedVideo && onVideoSelect) {
      onVideoSelect(nextRecommendedVideo.id);
    }
  };

  // Show shimmer when loading - match exact layout of actual video player
  if (isLoading) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-primary/10 flex flex-col min-h-[400px]">
        {/* Title shimmer */}
        <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
          <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
        </div>
        <div className="relative flex-1 min-h-0">
          {/* Video container shimmer - takes full available height */}
          <div className="relative w-full h-full bg-black rounded-md overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>
            {/* Play icon placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-600 rounded-full ml-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video || !videoUrl) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-primary/10 flex flex-col min-h-[400px]">
      <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
        {video.title ? (
          <h3 className="text-sm font-semibold text-primary">{video.title}</h3>
        ) : (
          <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
        )}
      </div>
      <div className="relative flex-1 min-h-0">
        {/* Video container that fills available height */}
        <div className="relative w-full h-full bg-muted/20 rounded-md overflow-hidden">
          <video
            ref={videoRef}
            key={videoId} // Force re-render when video changes
            src={videoUrl}
            controls
            className="w-full h-full min-h-full object-cover"
            preload="metadata"
            title={video.title}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Hidden preload thumbnail for next video - prevents flickering */}
        {nextRecommendedVideo && !hasEnded && (
          <div className="absolute opacity-0 pointer-events-none -z-10">
            <VideoThumbnail
              videoId={nextRecommendedVideo.id}
              getVideoById={getVideoById}
              getVideoUrl={getVideoUrl}
              onClick={() => {}} // No-op for preload
              isGlobalLoading={false}
            />
          </div>
        )}

        {/* Next Video Recommendation Overlay - Using VideoThumbnail Component */}
        {hasEnded && nextRecommendedVideo && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-all duration-500 ${
              showOverlay ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`flex flex-col items-start justify-center gap-2 transform transition-all duration-500 ${
                showOverlay ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
              }`}
            >
              <p className="text-xs text-white align-left w-full">Liked What you saw? Here's what is next.</p>
              <VideoThumbnail
                videoId={nextRecommendedVideo.id}
                getVideoById={getVideoById}
                getVideoUrl={getVideoUrl}
                onClick={handleNextVideoClick}
                onWatchNow={onWatchNow}
                isGlobalLoading={false}
                variant="recommendation"
                onLater={() => {
                  setShowOverlay(false);
                  setHasEnded(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
