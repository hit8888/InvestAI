import { Icons, Typography } from '@meaku/saral';
import { RefObject, useEffect, useState } from 'react';

interface SidebarArtifactContentProps {
  artifact: {
    url: string;
    artifactType: 'VIDEO' | 'SLIDE_IMAGE';
    title: string;
  };
  currentVideo: {
    url: string;
    isPlaying: boolean;
  } | null;
  videoError: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onPlayPauseToggle: () => void;
  onClose: () => void;
  onVideoError?: (error: string) => void;
}

export const SidebarArtifactContent = ({
  artifact,
  currentVideo,
  videoError,
  videoRef,
  onPlayPauseToggle,
  onClose,
  onVideoError,
}: SidebarArtifactContentProps) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [hasVideoLoadError, setHasVideoLoadError] = useState(false);

  // Stagger the content animation after the sidebar opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 150); // Delay content animation to start after sidebar starts opening

    return () => clearTimeout(timer);
  }, []);

  // Reset video error state when artifact changes
  useEffect(() => {
    setHasVideoLoadError(false);
  }, [artifact.url]);

  const handleVideoLoadError = () => {
    setHasVideoLoadError(true);
    if (onVideoError) {
      onVideoError('Failed to load video. Please check the URL and try again.');
    }
  };

  const handleVideoPlay = () => {
    // Sync state when user clicks play in native controls
    if (!currentVideo?.isPlaying) {
      onPlayPauseToggle();
    }
  };

  const handleVideoPause = () => {
    // Sync state when user clicks pause in native controls
    if (currentVideo?.isPlaying) {
      onPlayPauseToggle();
    }
  };

  const handleVideoEnded = () => {
    // Sync state when video ends
    if (currentVideo?.isPlaying) {
      onPlayPauseToggle();
    }
  };

  // Determine if we should show an error
  const shouldShowError = videoError || hasVideoLoadError;

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
                    className="w-full h-auto max-w-full object-contain"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onEnded={handleVideoEnded}
                    onError={handleVideoLoadError}
                    onLoadStart={() => {
                      setHasVideoLoadError(false);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center overflow-hidden">
            <img
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
