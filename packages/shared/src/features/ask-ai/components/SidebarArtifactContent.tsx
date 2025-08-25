import { Icons, Typography } from '@meaku/saral';
import { RefObject } from 'react';

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
}

export const SidebarArtifactContent = ({
  artifact,
  currentVideo,
  videoError,
  videoRef,
  onPlayPauseToggle,
  onClose,
}: SidebarArtifactContentProps) => {
  const handleVideoPlay = () => {
    if (!currentVideo?.isPlaying) {
      onPlayPauseToggle();
    }
  };

  const handleVideoPause = () => {
    if (currentVideo?.isPlaying) {
      onPlayPauseToggle();
    }
  };

  const handleVideoEnded = () => {
    if (currentVideo?.isPlaying) {
      onPlayPauseToggle();
    }
  };
  return (
    <div className="flex flex-col w-full min-h-0 h-full">
      <div className="flex justify-between items-center w-full rounded-t-[20px] flex-shrink-0 p-4 bg-white border-b sticky top-0 z-10">
        <Typography variant="body" fontWeight="medium" className="truncate flex-1 mr-2">
          {artifact.title}
        </Typography>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <Icons.X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden w-full p-4 pt-0 min-h-0">
        {artifact.artifactType === 'VIDEO' ? (
          <>
            {videoError ? (
              <div className="flex flex-col items-center justify-center text-center p-6 w-full">
                <Icons.AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <Typography variant="body" className="text-destructive mb-2">
                  Video Error
                </Typography>
                <Typography variant="body-small" className="text-muted-foreground">
                  {videoError}
                </Typography>
                <button
                  onClick={onPlayPauseToggle}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col border rounded-xl overflow-hidden w-full">
                <div className="flex items-center gap-2 w-full bg-primary/10 p-2 py-3 flex-shrink-0">
                  <Typography variant="body" fontWeight="medium" className="truncate flex-1 mr-2">
                    {artifact.title}
                  </Typography>
                </div>
                <div className="w-full overflow-hidden">
                  <video
                    ref={videoRef}
                    src={artifact.url}
                    controls
                    className="w-full h-auto max-w-full object-contain"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onEnded={handleVideoEnded}
                    onError={() => {
                      // Handle video loading errors
                      if (!videoError) {
                        // This will be handled by the play().catch() in the hook
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center overflow-hidden">
            <img src={artifact.url} alt="Artifact" className="w-full h-auto max-w-full object-contain rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};
