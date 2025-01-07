import { cn } from '@breakout/design-system/lib/cn';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat.tsx';
import { useArtifactStore } from '../../../../stores/useArtifactStore.ts';
import ArtifactControls from '../ArtifactControls.tsx';
import { SalesEvent } from '@meaku/core/types/webSocket';
import useAgentbotAnalytics from '../../../../hooks/useAgentbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useMessageStore } from '../../../../stores/useMessageStore.ts';

interface IProps {
  videoUrl: string;
  artifactId: string;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  isMediaTakingFullWidth: boolean;
}

const VideoArtifact = ({ videoUrl, artifactId, handleSendUserMessage, isMediaTakingFullWidth }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);

  const handleVideoOnEnd = () => {
    const payload = {
      artifact_type: 'VIDEO',
      artifact_id: artifactId,
    };
    handleSendUserMessage({ message: '', eventType: SalesEvent.ARTIFACT_CONSUMED, eventData: payload });
    setIsArtifactPlaying(false);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_COMPLETE);
  };

  const handleToggleFullScreen = useMessageStore((state) => state.handleToggleFullScreen);

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
  }, []);

  if (!videoUrl) return null;

  return (
    <div
      className={cn('group relative', {
        'h-full w-full': !isMediaTakingFullWidth,
        'h-screen w-auto': isMediaTakingFullWidth,
      })}
    >
      <video
        ref={videoRef}
        className={cn('absolute inset-0 h-full max-h-full w-full max-w-full', {
          'object-contain': !isMediaTakingFullWidth,
        })}
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
        handlePause={handlePlayPauseVideo}
        handleRestart={handleRestartVideo}
        handleToggleFullScreen={handleToggleFullScreen}
      />
    </div>
  );
};

export default VideoArtifact;
