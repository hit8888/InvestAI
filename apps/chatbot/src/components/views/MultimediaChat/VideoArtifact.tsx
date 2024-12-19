import { cn } from '@breakout/design-system/lib/cn';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useWebSocketChat from '../../../hooks/useWebSocketChat';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import ArtifactControls from './ArtifactControls';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  videoUrl: string;
  artifactId: string;
}

type QueryParams = {
  expandVideo?: boolean;
};

const VideoArtifact = (props: IProps) => {
  const { videoUrl, artifactId } = props;

  const { trackChatbotEvent } = useChatbotAnalytics();

  const [searchParams] = useSearchParams();
  const { expandVideo }: QueryParams = {
    expandVideo: searchParams.get('expandVideo') === 'true',
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { handleSendUserMessage } = useWebSocketChat();

  const isArtifactMaximized = useArtifactStore((state) => state.isArtifactMaximized);
  const shouldEndArtifactImmediately = useArtifactStore((state) => state.shouldEndArtifactImmediately);
  const setShouldEndArtifactImmediately = useArtifactStore((state) => state.setShouldEndArtifactImmediately);
  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);

  const handleVideoOnEnd = () => {
    const payload = {
      artifact_type: 'VIDEO',
      artifact_id: artifactId,
    };
    handleSendUserMessage('', 'ARTIFACT_CONSUMED', payload);
    setIsArtifactPlaying(false);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_COMPLETE);
  };

  const handlePlayPauseVideo = () => {
    if (!videoRef.current) return;

    setIsPlaying((prevState) => !prevState);

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsArtifactPlaying(true);
      trackChatbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PLAY);
    } else {
      videoRef.current.pause();
      trackChatbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PAUSE);
    }
  };

  const handleRestartVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsArtifactPlaying(true);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PLAY);
  };

  useEffect(() => {
    if (shouldEndArtifactImmediately) {
      if (videoRef.current) {
        videoRef.current.pause();
        try {
          videoRef.current.currentTime = videoRef.current.duration;
        } catch (error) {
          console.log('🚀 ~ file: VideoArtifact.tsx:83 ~ useEffect ~ error:', error);
        }
      }
      handleVideoOnEnd();
      setShouldEndArtifactImmediately(false);
      setIsArtifactPlaying(false);
    }
  }, [shouldEndArtifactImmediately]);

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
        'h-full w-full': !isArtifactMaximized,
        'h-screen w-auto': isArtifactMaximized,
      })}
    >
      <video
        ref={videoRef}
        className={cn('absolute inset-0 h-full max-h-full w-full max-w-full', {
          'object-cover': expandVideo,
          'object-contain': !isArtifactMaximized,
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

      <ArtifactControls isPlaying={isPlaying} handlePause={handlePlayPauseVideo} handleRestart={handleRestartVideo} />
    </div>
  );
};

export default VideoArtifact;
