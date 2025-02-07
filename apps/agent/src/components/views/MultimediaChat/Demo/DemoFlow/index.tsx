import { ScriptStepType } from '@meaku/core/types/agent';
import { ImagePlayer } from '../DemoQuestionFlow/ImagePlayer';
import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
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
import useSelectedFeatureStore from '../../../../../stores/useSelectedFeatureStore';
import { RaiseQuestionTrigger } from '../RaiseQuestionTrigger';
import { WaitDemoCompleteNotification } from '../Notifications/WaitDemoCompleteNotification';
import AnimatedSelectedFeaturesList from './AnimatedSelectedFeaturesList';
import useHalfDurationAudio from '../../../../../hooks/useHalfDurationAudio';

interface IProps {
  demoDetails: ScriptStepType;
  assetType: 'IMAGE' | 'VIDEO' | null;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  demoPlayingStatus: DemoPlayingStatus;
  onFinishDemo: () => void;
  handleDemoAudioEnd: () => void;
  shouldShowDemoAgent: boolean;
  setShowDemoAgent: Dispatch<SetStateAction<boolean>>;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
  showWaitDemoCompleteNotification: boolean;
}

const DemoFlow = ({
  demoDetails,
  assetType,
  setDemoPlayingStatus,
  demoPlayingStatus,
  onFinishDemo,
  handleDemoAudioEnd,
  shouldShowDemoAgent,
  setShowDemoAgent,
  onRaiseDemoQuery,
  showWaitDemoCompleteNotification,
}: IProps) => {
  const { selectedFeatures, isFirstSlideInDemoFlow } = useSelectedFeatureStore();
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

  const { hasTimeDurationPassed, hasOneByFifthDurationPassed } = useHalfDurationAudio({
    audioRef,
    duration,
    isFirstSlide: isFirstSlideInDemoFlow,
  });

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

  const showAnimatedSelectedFeaturesList = isFirstSlideInDemoFlow && hasOneByFifthDurationPassed;

  return (
    <>
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
          <div className="flex h-full w-full flex-col items-center gap-12 pt-6">
            <AnimatedSelectedFeaturesList
              showAnimatedSelectedFeaturesList={showAnimatedSelectedFeaturesList}
              selectedFeatures={selectedFeatures}
            />
            <ResponsePlayer
              message={demoDetails.message}
              canvasRef={canvasRef}
              audioDuration={duration}
              isPlaying={demoPlayingStatus === DemoPlayingStatus.PLAYING}
              orientation="column"
            />
          </div>
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
      </div>
      <div className="relative flex h-[8%] w-full flex-1 items-center justify-between gap-8 py-4">
        <motion.div
          initial={isFirstSlideInDemoFlow ? { x: '-50%', opacity: 0 } : { x: 0, opacity: 1 }}
          animate={hasTimeDurationPassed ? { x: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 80, damping: 15, duration: 3 }}
          className="flex items-center gap-8"
        >
          <RaiseQuestionTrigger
            shouldShowDemoAgent={shouldShowDemoAgent}
            setShowDemoAgent={setShowDemoAgent}
            onRaiseDemoQuery={onRaiseDemoQuery}
          />
          {showWaitDemoCompleteNotification && <WaitDemoCompleteNotification variant="default" />}
        </motion.div>
        <FinishDemo onFinishDemo={onFinishDemo} onPause={handlePause} />
      </div>
    </>
  );
};

export { DemoFlow };
