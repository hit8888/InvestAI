import { LucideIcon, Typography, VideoPlayer, cn, isDirectVideoFile } from '@meaku/saral';
import { RefObject, useEffect, useState, useCallback, useMemo } from 'react';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';
import ReactPlayer from 'react-player';

interface SidebarArtifactContentProps {
  artifact: {
    url: string;
    artifactType: 'VIDEO' | 'SLIDE_IMAGE' | 'PDF';
    title: string;
  };
  videoError: string | null;
  shouldAutoPlay?: boolean;
  videoRef: RefObject<ReactPlayer | null>;
  isPlaying?: boolean;
  onClose: () => void;
  onVideoError?: (error: string) => void;
  onReactPlayerPlay?: () => void;
  onReactPlayerPause?: () => void;
  onReactPlayerEnded?: () => void;
}

/**
 * SidebarArtifactContent - renders video/image artifacts in sidebar
 *
 * Animation timing:
 * - Content visibility: 150ms delay after sidebar opens
 * - Staggered animations: header (0ms), content (200ms delay)
 *
 * Video handling:
 * - Calculates display height from aspect ratio
 * - Stores height for next video load
 * - Shows loading state with background color
 */
export const SidebarArtifactContent = ({
  artifact,
  videoError,
  videoRef,
  shouldAutoPlay,
  isPlaying = false,
  onClose,
  onVideoError,
  onReactPlayerPlay,
  onReactPlayerPause,
  onReactPlayerEnded,
}: SidebarArtifactContentProps) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [hasVideoLoadError, setHasVideoLoadError] = useState(false);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const { screenWidth, screenHeight } = useScreenSize();

  // Stagger content animation after sidebar opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 150); // 150ms delay

    return () => clearTimeout(timer);
  }, []);

  // Reset video state on URL change
  useEffect(() => {
    setHasVideoLoadError(false);
    setIsVideoLoading(true);
  }, [artifact.url]);

  const handleVideoLoadError = () => {
    setHasVideoLoadError(true);
    if (onVideoError) {
      onVideoError('Failed to load video. Please check the URL and try again.');
    }
  };

  const handleVideoLoadStart = () => {
    setHasVideoLoadError(false);
    setIsVideoLoading(true);
  };

  const shouldShowError = videoError || hasVideoLoadError;

  /**
   * Recalculates video height on window resize
   * Uses stored aspect ratio to maintain proportions
   */
  const recalculateVideoHeight = useCallback(() => {
    if (!videoRef.current || !videoAspectRatio || artifact.artifactType !== 'VIDEO') return;

    // Get the wrapper element of ReactPlayer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = (videoRef.current as any).wrapper;
    if (!wrapper) return;

    const containerWidth = wrapper.parentElement?.clientWidth || wrapper.clientWidth;
    const newHeight = containerWidth / videoAspectRatio;
    setVideoHeight(newHeight);
  }, [videoRef, videoAspectRatio, artifact.artifactType]);

  // Recalculate video height on window resize (debounced via useScreenSize)
  useEffect(() => {
    recalculateVideoHeight();
  }, [screenWidth, screenHeight, recalculateVideoHeight]);

  const isNativeVideo = useMemo(() => {
    return (artifact.artifactType === 'VIDEO' || !artifact.artifactType) && isDirectVideoFile(artifact.url);
  }, [artifact.artifactType, artifact.url]);

  return (
    <div className="flex flex-col w-full min-h-0 h-full">
      <div
        className={`flex justify-between items-center w-full rounded-t-[20px] flex-shrink-0 p-4 bg-white border-b sticky top-0 z-10 transition-all duration-500 ease-out ${
          isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
      >
        <Typography variant="body" fontWeight="medium" className="truncate flex-1 mr-2">
          {artifact.title}
        </Typography>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors duration-200">
            <LucideIcon name="x" className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 flex items-center justify-center overflow-hidden w-full p-4 min-h-0 transition-all duration-700 ease-out delay-200 ${
          isContentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {artifact.artifactType === 'VIDEO' ? (
          <>
            {shouldShowError ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                <LucideIcon name="alert-circle" className="h-12 w-12 text-destructive" />
                <div className="flex flex-col gap-2">
                  <Typography variant="body" fontWeight="medium">
                    Video Error
                  </Typography>
                  <Typography variant="body-small" className="text-muted-foreground">
                    {videoError || 'Failed to load video. Please check the URL and try again.'}
                  </Typography>
                </div>
              </div>
            ) : (
              <div
                className={cn('flex flex-col rounded-xl border overflow-hidden w-full h-full', {
                  'h-[90%]': isNativeVideo,
                })}
              >
                <VideoPlayer
                  key={artifact.url}
                  forceReactPlayer
                  ref={videoRef}
                  url={artifact.url}
                  controls
                  playing={isPlaying || shouldAutoPlay}
                  width="100%"
                  height="100%"
                  minHeight={
                    isVideoLoading
                      ? videoHeight
                        ? `${videoHeight}px`
                        : `${Math.min(window.innerHeight * 0.8, 600)}px`
                      : undefined
                  }
                  style={{
                    backgroundColor: isVideoLoading ? '#f3f4f6' : 'transparent', // Light background while loading
                  }}
                  config={{
                    file: {
                      attributes: {
                        preload: 'metadata',
                      },
                    },
                  }}
                  onError={handleVideoLoadError}
                  onStart={handleVideoLoadStart}
                  onPlay={() => {
                    // Sync state for iframe players (YouTube, Vimeo, etc.)
                    onReactPlayerPlay?.();
                  }}
                  onPause={() => {
                    // Sync state for iframe players (YouTube, Vimeo, etc.)
                    onReactPlayerPause?.();
                  }}
                  onEnded={() => {
                    // Sync state when video ends (all player types)
                    onReactPlayerEnded?.();
                  }}
                  onReady={() => {
                    // Calculate and store aspect ratio for resize handling
                    if (!videoRef.current) return;

                    const player = videoRef.current.getInternalPlayer();
                    if (player && player.videoHeight && player.videoWidth) {
                      const height = player.videoHeight;
                      const width = player.videoWidth;
                      const aspectRatio = width / height;

                      // Store aspect ratio for resize calculations
                      setVideoAspectRatio(aspectRatio);

                      // Calculate initial display height
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const wrapper = (videoRef.current as any).wrapper;
                      if (wrapper) {
                        const containerWidth = wrapper.parentElement?.clientWidth || wrapper.clientWidth;
                        const displayHeight = containerWidth / aspectRatio;
                        setVideoHeight(displayHeight);
                      }
                      setIsVideoLoading(false);
                    }
                  }}
                />
              </div>
            )}
          </>
        ) : artifact.artifactType === 'PDF' ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <iframe
              key={artifact.url}
              src={artifact.url}
              title={artifact.title}
              className={`w-full h-full rounded-xl transition-all duration-700 ease-out delay-200 ${
                isContentVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center overflow-hidden">
            <img
              key={artifact.url}
              src={artifact.url}
              alt="Artifact"
              className={`w-full h-auto max-w-full object-contain rounded-xl transition-all duration-700 ease-out delay-200 ${
                isContentVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
