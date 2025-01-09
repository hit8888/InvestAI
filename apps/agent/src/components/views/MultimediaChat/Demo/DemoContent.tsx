import { memo, useRef, useState } from 'react';
import { ScriptStepType } from '@meaku/core/types/agent';
import { DemoFooter } from './DemoFooter';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { cn } from '@breakout/design-system/lib/cn';
import { PauseIcon, PlayIcon } from 'lucide-react';
import useAgentbotAnalytics from '../../../../hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useAudioController } from '../../../../hooks/useAudioController';
import { useAudioVisualizer } from '../../../../hooks/useAudioVisualizer';

interface IProps {
  demoDetails: ScriptStepType;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  onStepEnd: () => void;
  onFinishDemo: () => void;
}

const DemoContent = ({ demoDetails, demoPlayingStatus, setDemoPlayingStatus, onStepEnd, onFinishDemo }: IProps) => {
  const isQueryRaisedRef = useRef(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handleAudioEnd = () => {
    if (isQueryRaisedRef.current) {
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      return;
    }
    if (demoDetails?.is_end) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_COMPLETED);
      onFinishDemo();
      return;
    }
    onStepEnd();
  };

  const { audioRef, playPromiseRef, analyserNode } = useAudioController(
    demoDetails?.audio_url,
    handleAudioEnd,
    Boolean(demoDetails?.audio_url),
  );

  const canvasRef = useAudioVisualizer({
    analyserNode,
    audioUrl: demoDetails.audio_url ?? '',
  });

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
        playPromiseRef.current = audio.play();
        await playPromiseRef.current;
      } else {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_INTERUPTED);
        audio.pause();
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
      audio.pause();
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
    } catch (error) {
      console.error('Error handling pause:', error);
    }
  };

  const handleRaiseDemoQuery = (queryRaised: boolean) => {
    isQueryRaisedRef.current = queryRaised;
  };

  const handleCloseDemoAgent = () => {
    onStepEnd();
    isQueryRaisedRef.current = false;
  };

  return (
    <>
      <div className={'relative flex h-[92%] w-full items-center justify-center'}>
        {demoDetails.asset_url ? (
          <div className={'relative flex h-[92%] w-full items-center justify-center'}>
            {!isImageLoaded && (
              <div className="absolute inset-0 scale-95 bg-gray-200 opacity-0 blur-sm transition-all duration-500 ease-in-out hover:scale-100 hover:opacity-100 hover:blur-none" />
            )}
            <img
              className={`max-h-full w-full object-fill transition-all duration-500 ease-out ${
                isImageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              src={demoDetails.asset_url}
              alt={demoDetails.message}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        ) : (
          <div className={'flex h-[92%] w-full flex-col items-center justify-center'}>
            <div className="fixed inset-0 h-screen w-screen bg-primary-foreground"></div>
            <canvas
              ref={canvasRef}
              className="h-[72px] w-[72px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.2), rgb(var(--primary)/ 0.8) 50%, rgba(0, 0, 0, 1) 100%)',
                boxShadow: 'inset -4px -4px 8px rgba(0, 0, 0, 0.2), inset 4px 4px 8px rgba(255, 255, 255, 0.2)',
                transform: 'perspective(500px) rotateX(10deg)',
              }}
            />
            <div className="z-10 mx-[20%] mt-8">
              <span className="text-primary/70">{demoDetails.message}</span>
            </div>
          </div>
        )}
      </div>
      <div
        className={cn(
          'absolute bottom-[72px] left-2 right-2 top-[58px] z-10 flex cursor-pointer items-center justify-center bg-black/30',
          {
            'opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100':
              demoPlayingStatus === DemoPlayingStatus.PLAYING,
          },
        )}
        onClick={handlePlayPause}
      >
        {demoPlayingStatus === DemoPlayingStatus.PLAYING ? (
          <PauseIcon className="fill-white text-white" size={60} />
        ) : (
          <PlayIcon className="fill-white text-white" size={60} />
        )}
      </div>

      <div className="relative flex h-[8%] w-full flex-1 items-center py-4">
        {demoDetails.asset_url && (
          <canvas
            ref={canvasRef}
            className="absolute bottom-1 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.2), rgb(var(--primary)/ 0.7) 50%, rgba(0, 0, 0, 1) 100%)',
              boxShadow: 'inset -4px -4px 8px rgba(0, 0, 0, 0.2), inset 4px 4px 8px rgba(255, 255, 255, 0.2)',
              transform: 'perspective(500px) rotateX(10deg)',
              cursor: 'pointer',
            }}
          />
        )}
        <DemoFooter
          isDemoPlaying={DemoPlayingStatus.PLAYING === demoPlayingStatus}
          onRaiseDemoQuery={handleRaiseDemoQuery}
          onCloseDemoAgent={handleCloseDemoAgent}
          onFinishDemo={onFinishDemo}
          onPause={handlePause}
        />
      </div>
    </>
  );
};

export default memo(DemoContent);
