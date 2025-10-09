import { useRef } from 'react';
import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';

interface HiddenExternalVideoPlayerProps {
  videoUrl: string;
  onDurationReady: (duration: number) => void;
  onError?: (error: Error) => void;
}

/**
 * Hidden video player component to fetch duration from external video URLs (YouTube, Vimeo, etc.)
 * This component renders a hidden player that loads the video metadata to extract the duration.
 * Uses CustomVideoPlayer which internally handles ReactPlayer for external URLs.
 *
 * @param videoUrl - The external video URL
 * @param onDurationReady - Callback when duration is successfully retrieved
 * @param onError - Optional callback when an error occurs
 */
const HiddenExternalVideoPlayer = ({ videoUrl, onDurationReady, onError }: HiddenExternalVideoPlayerProps) => {
  const hasFetchedDuration = useRef(false);

  const handleLoadedMetadata = (duration: number) => {
    if (hasFetchedDuration.current) return;

    try {
      if (duration && !isNaN(duration) && isFinite(duration) && duration > 0) {
        hasFetchedDuration.current = true;
        onDurationReady(duration);
      } else {
        onError?.(new Error('Could not retrieve valid video duration'));
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Unknown error while fetching duration'));
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        opacity: 0,
        pointerEvents: 'none',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: -9999,
      }}
    >
      <CustomVideoPlayer
        videoURL={videoUrl}
        showControls={false}
        allowPictureInPicture={false}
        allowDownload={false}
        onLoadedMetadata={handleLoadedMetadata}
        className="h-1 w-1"
      />
    </div>
  );
};

export default HiddenExternalVideoPlayer;
