import { cn } from '@breakout/design-system/lib/cn';
import { useRef, useState } from 'react';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { ArtifactEnum } from '@meaku/core/types/artifact';
import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import ReactPlayer from 'react-player';

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
  // handleToggleFullScreen,
  setIsArtifactPlaying,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  const handleVideoOnEnd = () => {
    if (!playerRef.current) return;

    const video = playerRef.current;
    // Check if we're actually at the end of the video
    // Adding small buffer (0.1s) to account for floating point precision
    if (Math.abs(video.getCurrentTime() - video.getDuration()) > 0.1) return;

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

  const handlePlayAndPause = () => {
    setIsPlaying(!isPlaying);
    setIsArtifactPlaying(!isPlaying);
    trackAgentbotEvent(
      !isPlaying ? ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PLAY : ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PAUSE,
    );
  };

  const handleRestartVideo = () => {
    if (!playerRef.current) return;

    playerRef.current.seekTo(0);
    setIsPlaying(true);
    setIsArtifactPlaying(true);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.VIDEO_ARTIFACT_PLAY);
  };

  if (!videoUrl) return null;

  return (
    <div
      className={cn('flex h-full ', {
        'w-full': !isMediaTakingFullWidth,
        'w-full max-w-full': isMediaTakingFullWidth,
      })}
    >
      <AspectRatio ratio={16 / 9}>
        <div className="relative h-full w-full h-xs:max-h-[200px] h-sm:max-h-[300px]" onClick={handlePlayAndPause}>
          <PlayAndPauseIconDisplay handlePlayAndPause={handlePlayAndPause} isPlaying={isPlaying} />
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={isPlaying}
            width="100%"
            height="100%"
            onEnded={handleVideoOnEnd}
            controls={true}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            config={{
              file: {
                attributes: {
                  style: { objectFit: 'fill', width: '100%', height: '100%' },
                  // Prevent video download through browser's context menu
                  controlsList: 'nodownload',
                  // Disable right-click context menu
                  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
                },
              },
            }}
            // Disable light mode (preview thumbnail)
            light={false}
            // Disable picture-in-picture mode
            pip={true}
            // Keep video playing when component unmounts
            stepOnUnmount={false}
            // Additional progress tracking for video completion
            onProgress={({ played }) => {
              if (played === 1) {
                handleVideoOnEnd();
              }
            }}
            // Detect when video is seeked to start (restart)
            onSeek={(seconds) => {
              if (seconds === 0) {
                handleRestartVideo();
              }
            }}
          />
        </div>
      </AspectRatio>
    </div>
  );
};

type PlayAndPauseIconDisplayProps = {
  handlePlayAndPause: () => void;
  isPlaying: boolean;
};

const PlayAndPauseIconDisplay = ({ handlePlayAndPause, isPlaying }: PlayAndPauseIconDisplayProps) => {
  return (
    <div
      className={cn('absolute inset-0 z-10 flex h-[80%] cursor-pointer items-center justify-center', {
        'opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100': isPlaying,
      })}
      onClick={handlePlayAndPause}
    >
      {isPlaying ? (
        <PauseIcon className="fill-gray-500 text-gray-500" size={60} />
      ) : (
        <PlayIcon className="fill-gray-500 text-gray-500" size={60} />
      )}
    </div>
  );
};

export default VideoArtifact;
