import { Video } from '../types';
import { useRef, useState, useEffect } from 'react';
import { VideoThumbnail } from './VideoThumbnail';
import { motion, AnimatePresence } from 'framer-motion';

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
  watchedVideos: string[];
  addWatchedVideo: (videoId: string) => void;
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
  watchedVideos,
  addWatchedVideo,
}: MainVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasEnded, setHasEnded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const video = videoId ? getVideoById(videoId) : null;

  // Use direct video URL for progressive buffering (no full caching)
  const videoUrl = video ? getVideoUrl(video) : null;

  // Find next recommended video
  const getNextRecommendedVideo = (): Video | null => {
    if (!videoId || allVideoIds.length === 0) return null;

    // First, try to find an unplayed video
    const unplayedVideoId = allVideoIds.find((id) => !watchedVideos.includes(id) && id !== videoId);
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
        // Mark current video as watched when recommendation overlay appears
        if (videoId) {
          addWatchedVideo(videoId);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasEnded, nextRecommendedVideo, videoId, addWatchedVideo]);

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
  };

  const handleNextVideoClick = () => {
    if (nextRecommendedVideo && onVideoSelect) {
      onVideoSelect(nextRecommendedVideo.id);
    }
  };

  // Show shimmer when loading - match exact layout of actual video player
  if (isLoading) {
    return (
      <>
        <div className="relative w-full overflow-hidden rounded-lg border border-primary/10 flex flex-col min-h-[440px]">
          {/* Title shimmer */}
          <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
            <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="relative flex-1 bg-card">
            {/* Video container shimmer - fill full height of 440px container */}
            <div className="w-full h-full rounded-md overflow-hidden">
              {/* Bottom shadow overlay - similar to video controls shadow */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 to-transparent"></div>
              {/* Video loading spinner - similar to browser video loader */}
              <div className="absolute inset-0 -top-2 flex items-center justify-center">
                <div className="relative">
                  {/* Android-style arc with Framer Motion */}
                  <svg className="w-20 h-20" viewBox="0 0 84 84">
                    <motion.circle
                      cx="42"
                      cy="42"
                      r="35"
                      fill="none"
                      stroke="black"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="0 251.2"
                      initial={{ strokeDasharray: '0 251.2' }}
                      animate={{
                        strokeDasharray: ['0 251.2', '125.6 125.6', '0 251.2'],
                        rotate: [0, 360, 720],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!video || !videoUrl) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-primary/10 flex flex-col min-h-[440px]">
      <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
        {video.title ? (
          <h3 className="text-sm font-semibold text-primary">{video.title}</h3>
        ) : (
          <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
        )}
      </div>
      <div className="relative">
        {/* Video container with aspect ratio */}
        <div className="relative w-full aspect-video bg-muted/20 rounded-md overflow-hidden">
          <AnimatePresence mode="wait">
            {videoUrl && (
              <motion.div
                key="video-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'linear' }}
                className="absolute inset-0"
              >
                <video
                  ref={videoRef}
                  key={videoId} // Force re-render when video changes
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                  title={video.title}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                >
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            )}
          </AnimatePresence>
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
