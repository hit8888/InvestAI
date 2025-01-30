import { ScriptStepType } from '@meaku/core/types/agent';
import { ImagePlayer } from '../DemoQuestionFlow/ImagePlayer';
import { useRef, useState, useEffect } from 'react';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { VideoPlayer } from '../DemoQuestionFlow/VideoPlayer';
import { DemoControls } from '../DemoQuestionFlow/DemoControls';
import { FinishDemo } from '../FinishDemo';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { useAudioVisualizer } from '@meaku/core/hooks/useAudioVisualizer';
import { useAudioController } from '@meaku/core/hooks/useAudioController';
import ReactPlayer from 'react-player';
import { ResponsePlayer } from '../DemoQuestionFlow/components/ResponsePlayer';

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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [assetLoadError, setAssetLoadError] = useState(false);
  const videoRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (demoDetails.asset_url && assetType === 'VIDEO') {
      setIsVideoPlaying(true);
      setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
    }
  }, [demoDetails.asset_url, assetType]);

  const handleAssetError = () => {
    console.error('Asset failed to load');
    setAssetLoadError(true);
    if (assetType === 'IMAGE') setIsImageLoaded(true);
    if (assetType === 'VIDEO') setIsVideoLoaded(true);
  };

  const { audioRef, playPromiseRef, analyserNode, duration } = useAudioController(
    demoDetails?.audio_url,
    handleDemoAudioEnd,
    Boolean(demoDetails?.audio_url) && (!demoDetails.asset_url || assetLoadError || isImageLoaded || isVideoLoaded),
  );

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (!audio && !video) return;

    try {
      if (audio?.paused || !isVideoPlaying) {
        setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
        setIsVideoPlaying(true);
        if (audio) {
          playPromiseRef.current = audio.play();
          await playPromiseRef.current;
        }
      } else {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_INTERUPTED);
        if (audio) audio.pause();
        setIsVideoPlaying(false);
        setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      }
    } catch (error) {
      console.error('Error handling play/pause:', error);
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
    }
  };

  const handlePause = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      setIsVideoPlaying(false);
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
              onError={handleAssetError}
            />
          )}
          {assetType === 'VIDEO' && (
            <VideoPlayer
              url={demoDetails.asset_url}
              onLoadComplete={() => setIsVideoLoaded(true)}
              onError={handleAssetError}
              videoRef={videoRef}
              playing={isVideoPlaying}
              audioDuration={duration}
            />
          )}
          {assetLoadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
              <span className="text-sm text-gray-500">Media content unavailable</span>
            </div>
          )}
        </>
      ) : (
        <ResponsePlayer
          message={demoDetails.message}
          canvasRef={canvasRef}
          audioDuration={duration}
          isPlaying={demoPlayingStatus === DemoPlayingStatus.PLAYING}
          orientation="column"
        />
      )}
      <DemoControls playingStatus={demoPlayingStatus} onPlayPause={handlePlayPause} />
      {demoDetails.asset_url && (
        <canvas
          ref={canvasRef}
          className="fixed bottom-2 left-1/2 flex h-[64px] w-[64px] -translate-x-1/2 items-center justify-center rounded-full"
          style={{
            background:
              'radial-gradient(61.46% 61.46% at 50% 38.54%, #f5f5ff 0%, var(--input-color, rgb(var(--primary))) 100%)',
            boxShadow: '0px 0px 12px 1px #fff, 0px 4px 8px 0px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(7px)',
            borderRadius: '96px',
          }}
        />
      )}
      <FinishDemo onFinishDemo={onFinishDemo} onPause={handlePause} />
    </div>
  );
};

export { DemoFlow };
