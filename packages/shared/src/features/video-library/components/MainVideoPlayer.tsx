import { Video } from '../types';
import { useRef, useState, useEffect } from 'react';
import { VideoThumbnail } from './VideoThumbnail';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from '@meaku/saral';
import ReactPlayer from 'react-player';

interface MainVideoPlayerProps {
  videoId: string | null;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  isLoading?: boolean;
  onVideoEnd: () => void;
  onVideoSelect?: (videoId: string) => void;
  showRecommendation: boolean;
  allVideoIds?: string[];
  onWatchNow?: (videoId: string) => void;
  onLater?: () => void;
  getNextRecommendedVideo: () => Video | null;
}

export const MainVideoPlayer = ({
  videoId,
  getVideoById,
  getVideoUrl,
  isLoading = false,
  onVideoEnd,
  onVideoSelect,
  showRecommendation,
  onWatchNow,
  onLater,
  getNextRecommendedVideo,
}: MainVideoPlayerProps) => {
  const videoRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const video = videoId ? getVideoById(videoId) : null;
  const videoUrl = video ? getVideoUrl(video) : null;
  const nextRecommendedVideo = getNextRecommendedVideo();

  // Reset playing state when video changes to ensure autoplay
  useEffect(() => {
    setIsPlaying(true);
  }, [videoId]);

  const handleVideoEnded = () => {
    onVideoEnd();
  };

  const handleNextVideoClick = () => {
    if (nextRecommendedVideo && onVideoSelect) {
      onVideoSelect(nextRecommendedVideo.id);
    }
  };

  const handlePlayPauseToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
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
    <div className="relative w-full rounded-lg border border-primary/10 flex flex-col min-h-[440px]">
      <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
        {video.title ? (
          <h3 className="text-sm font-semibold text-primary">{video.title}</h3>
        ) : (
          <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
        )}
      </div>
      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Video container with aspect ratio */}
        <div className="relative w-full aspect-video bg-muted/20 overflow-hidden">
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
                <ReactPlayer
                  key={videoId}
                  ref={videoRef}
                  url={videoUrl}
                  playing={isPlaying}
                  controls
                  width="100%"
                  height="100%"
                  playsinline
                  onEnded={handleVideoEnded}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                        playsInline: true,
                        style: {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        },
                      },
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover Overlay with Play/Pause Button */}
        {!showRecommendation && (
          <div className="absolute inset-0 bottom-20 flex items-center justify-center pointer-events-none z-20">
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  type="button"
                  className="w-20 h-20 bg-foreground/70 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 pointer-events-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={handlePlayPauseToggle}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <LucideIcon
                    name={isPlaying ? 'pause' : 'play'}
                    className={`w-8 h-8 text-gray-100 fill-gray-100 ${isPlaying ? '' : 'ml-0.5'}`}
                  />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Hidden preload thumbnail for next video - prevents flickering */}
        {nextRecommendedVideo && !showRecommendation && (
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
        {showRecommendation && nextRecommendedVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-all duration-500 opacity-100 rounded-b-lg">
            <div className="flex flex-col items-start justify-center gap-2 transform transition-all duration-500 translate-y-0 scale-100">
              <p className="text-xs text-white align-left w-full">Liked What you saw? Here's what is next.</p>
              <VideoThumbnail
                videoId={nextRecommendedVideo.id}
                getVideoById={getVideoById}
                getVideoUrl={getVideoUrl}
                onClick={handleNextVideoClick}
                isGlobalLoading={false}
                variant="recommendation"
                onWatchNow={onWatchNow}
                onLater={onLater}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
