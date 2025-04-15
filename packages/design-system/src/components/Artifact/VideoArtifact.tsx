import { cn } from '@breakout/design-system/lib/cn';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import ArtifactControls from '../layout/ArtifactControls.tsx';
import { ArtifactEnum } from '@meaku/core/types/artifact';
import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';

interface IProps {
  videoUrl: string;
  artifactId: string;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
}

const VideoArtifact = ({
  videoUrl,
  artifactId,
  handleSendUserMessage,
  isMediaTakingFullWidth,
  handleToggleFullScreen,
  setIsArtifactPlaying,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoOnEnd = () => {
    // Add checks to ensure video has actually ended
    if (!videoRef.current) return;

    const video = videoRef.current;
    // Check if we're actually at the end of the video
    // Adding small buffer (0.1s) to account for floating point precision
    if (Math.abs(video.currentTime - video.duration) > 0.1) return;

    const payload = {
      artifact_type: ArtifactEnum.VIDEO,
      artifact_id: artifactId,
    };
    handleSendUserMessage({
      message: { content: '', event_type: 'ARTIFACT_CONSUMED', event_data: payload },
      message_type: 'ARTIFACT',
    });
    setIsPlaying(false);
    setIsArtifactPlaying(false);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_COMPLETE);
  };

  const handlePlayPauseVideo = () => {
    if (!videoRef.current) return;

    setIsPlaying((prevState) => !prevState);

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsArtifactPlaying(true);
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PLAY);
    } else {
      videoRef.current.pause();
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PAUSE);
    }
  };

  const handleRestartVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsArtifactPlaying(true);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PLAY);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoOnEnd);

      return () => {
        videoElement.removeEventListener('ended', handleVideoOnEnd);
      };
    }
  }, [handleVideoOnEnd]);

  if (!videoUrl) return null;

  return (
    <div
      className={cn('flex h-full ', {
        'w-full': !isMediaTakingFullWidth,
        'w-full max-w-full': isMediaTakingFullWidth,
      })}
    >
      <AspectRatio ratio={16 / 9}>
        <div className="h-full w-full">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full"
            // controls
            autoPlay={false}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            className={cn('absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/30', {
              'opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100': isPlaying,
            })}
            onClick={handlePlayPauseVideo}
          >
            {isPlaying ? (
              <PauseIcon className="fill-white text-white" size={60} />
            ) : (
              <PlayIcon className="fill-white text-white" size={60} />
            )}
          </div>

          <ArtifactControls
            isPlaying={isPlaying}
            isMediaTakingFullWidth={isMediaTakingFullWidth}
            handlePause={handlePlayPauseVideo}
            handleRestart={handleRestartVideo}
            handleToggleFullScreen={handleToggleFullScreen}
          />
        </div>
      </AspectRatio>
    </div>
  );
};

export default VideoArtifact;
