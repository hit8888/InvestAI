import { ScriptStepType } from '@meaku/core/types/agent';
import { ImagePlayer } from '../DemoQuestionFlow/ImagePlayer';
import { useRef, useState } from 'react';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { VideoPlayer } from '../DemoQuestionFlow/VideoPlayer';
import { DemoControls } from '../DemoQuestionFlow/DemoControls';
import { AudioWithTextPlayer } from '../DemoQuestionFlow/AudioWithTextPlayer';
import { FinishDemo } from '../FinishDemo';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { useAudioVisualizer } from '@meaku/core/hooks/useAudioVisualizer';
import { useAudioController } from '@meaku/core/hooks/useAudioController';
interface IProps {
  demoDetails: ScriptStepType;
  assetType: 'IMAGE' | 'VIDEO' | null;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  demoPlayingStatus: DemoPlayingStatus;
  onFinishDemo: () => void;
  handleDemoAudioEnd: () => void;
}

const DemoFlow = ({
  demoDetails,
  assetType,
  setDemoPlayingStatus,
  demoPlayingStatus,
  onFinishDemo,
  handleDemoAudioEnd,
}: IProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { audioRef, playPromiseRef, analyserNode } = useAudioController(
    demoDetails?.audio_url,
    handleDemoAudioEnd,
    (Boolean(demoDetails?.audio_url) && !demoDetails.asset_url) ||
      (Boolean(demoDetails?.audio_url) && (isImageLoaded || isVideoLoaded)),
  );

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (!audio && !video) return;

    try {
      if (audio?.paused || video?.paused) {
        setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
        if (audio) {
          playPromiseRef.current = audio.play();
          await playPromiseRef.current;
        }
        if (video) {
          const videoPlayPromise = video.play();
          await videoPlayPromise;
        }
      } else {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_INTERUPTED);
        if (audio) audio.pause();
        if (video) video.pause();
        setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      }
    } catch (error) {
      console.error('Error handling play/pause:', error);
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
    }
  };

  const handlePause = async () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (!audio && !video) return;

    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      if (video) {
        const videoPlayPromise = video.play();
        if (videoPlayPromise !== undefined) {
          await videoPlayPromise;
        }
        video.pause();
      }
      if (audio) audio.pause();
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
    } catch (error) {
      console.error('Error handling pause:', error);
    }
  };

  const canvasRef = useAudioVisualizer({
    analyserNode,
    audioUrl: demoDetails.audio_url ?? '',
  });

  return (
    <div className={'relative flex h-[92%] w-full items-center justify-center'}>
      {demoDetails.asset_url ? (
        <>
          {assetType === 'IMAGE' && (
            <ImagePlayer
              url={demoDetails.asset_url}
              alt={demoDetails.message}
              onLoadComplete={() => setIsImageLoaded(true)}
            />
          )}
          {assetType === 'VIDEO' && (
            <VideoPlayer url={demoDetails.asset_url} onLoadComplete={() => setIsVideoLoaded(true)} />
          )}
        </>
      ) : (
        <AudioWithTextPlayer message={demoDetails.message} canvasRef={canvasRef} />
      )}
      <DemoControls playingStatus={demoPlayingStatus} onPlayPause={handlePlayPause} />
      {demoDetails.asset_url && (
        <canvas
          ref={canvasRef}
          className="fixed bottom-1 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full"
          style={{
            background:
              'radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.2), rgb(var(--primary)/ 0.7) 50%, rgba(0, 0, 0, 1) 100%)',
            boxShadow: 'inset -4px -4px 8px rgba(0, 0, 0, 0.2), inset 4px 4px 8px rgba(255, 255, 255, 0.2)',
            transform: 'perspective(500px) rotateX(10deg)',
            cursor: 'pointer',
          }}
        />
      )}
      <FinishDemo onFinishDemo={onFinishDemo} onPause={handlePause} />
    </div>
  );
};

export { DemoFlow };
