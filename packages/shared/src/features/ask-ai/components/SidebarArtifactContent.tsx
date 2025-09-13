import { Icons, Typography } from '@meaku/saral';
import { RefObject, useEffect, useState, useCallback } from 'react';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';

interface SidebarArtifactContentProps {
  artifact: {
    url: string;
    artifactType: 'VIDEO' | 'SLIDE_IMAGE';
    title: string;
  };
  videoError: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onClose: () => void;
  onVideoError?: (error: string) => void;
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
  onClose,
  onVideoError,
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

    const containerWidth = videoRef.current.parentElement?.clientWidth || videoRef.current.clientWidth;
    const newHeight = containerWidth / videoAspectRatio;
    setVideoHeight(newHeight);
  }, [videoRef, videoAspectRatio, artifact.artifactType]);

  // Recalculate video height on window resize (debounced via useScreenSize)
  useEffect(() => {
    recalculateVideoHeight();
  }, [screenWidth, screenHeight, recalculateVideoHeight]);

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
            <Icons.X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 flex items-center justify-center overflow-hidden w-full p-4 pt-0 min-h-0 transition-all duration-700 ease-out delay-200 ${
          isContentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {artifact.artifactType === 'VIDEO' ? (
          <>
            {shouldShowError ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                <Icons.AlertCircle className="h-12 w-12 text-destructive" />
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
              <div className="flex flex-col border rounded-xl overflow-hidden w-full">
                <div className="w-full overflow-hidden">
                  <video
                    ref={videoRef}
                    src={artifact.url}
                    controls
                    preload="metadata"
                    className="w-full h-auto max-w-full object-contain"
                    style={{
                      minHeight: isVideoLoading
                        ? videoHeight
                          ? `${videoHeight}px`
                          : `${Math.min(window.innerHeight * 0.8, 600)}px`
                        : 'auto', // Use stored height or 80% of viewport (max 600px)
                      backgroundColor: isVideoLoading ? '#f3f4f6' : 'transparent', // Light background while loading
                    }}
                    // Video play/pause/ended events are handled in useSidebarArtifact hook
                    onError={handleVideoLoadError}
                    onLoadStart={handleVideoLoadStart}
                    onLoadedMetadata={(e) => {
                      // Calculate and store aspect ratio for resize handling
                      const video = e.target as HTMLVideoElement;
                      const height = video.videoHeight;
                      const width = video.videoWidth;
                      const aspectRatio = width / height;

                      // Store aspect ratio for resize calculations
                      setVideoAspectRatio(aspectRatio);

                      // Calculate initial display height
                      const containerWidth = video.parentElement?.clientWidth || video.clientWidth;
                      const displayHeight = containerWidth / aspectRatio;
                      setVideoHeight(displayHeight);
                      setIsVideoLoading(false);
                    }}
                  />
                </div>
              </div>
            )}
          </>
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
