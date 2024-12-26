import { Dispatch, memo, SetStateAction, useEffect, useRef, useState } from 'react';
import { ScriptStepType } from '@meaku/core/types/chat';
import { DemoQuestions } from './DemoQuestions';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { cn } from '@breakout/design-system/lib/cn';
import { PauseIcon, PlayIcon } from 'lucide-react';

interface IProps {
  demoDetails: ScriptStepType;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: Dispatch<SetStateAction<DemoPlayingStatus>>;
  onStepEnd: () => void;
}

const DemoContent = ({ demoDetails, demoPlayingStatus, setDemoPlayingStatus, onStepEnd }: IProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isQueryRaisedRef = useRef(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleAudioEnd = () => {
    if (isQueryRaisedRef.current) {
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      return;
    }
    onStepEnd();
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setDemoPlayingStatus(DemoPlayingStatus.PLAYING); // This might be premature
      audio
        .play()
        .then(() => {
          setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
        });
    } else {
      audio.pause();
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
    }
  };

  useEffect(() => {
    if (!demoDetails?.audio_url || (demoDetails.asset_url && !isImageLoaded)) {
      return;
    }

    if (audioRef.current?.src === demoDetails.audio_url && !audioRef.current.paused) {
      return;
    }

    const newAudio = new Audio(demoDetails.audio_url);
    audioRef.current = newAudio;

    // Add ended event listener right after creating audio
    newAudio.addEventListener('ended', handleAudioEnd);

    newAudio.load();
    newAudio.currentTime = 0;
    newAudio
      .play()
      .then(() => {
        setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
        onStepEnd();
      });

    return () => {
      newAudio.removeEventListener('ended', handleAudioEnd);
      newAudio.pause();
      audioRef.current = null;
    };
  }, [demoDetails?.audio_url, isImageLoaded]);

  const handleRaiseDemoQuery = (queryRaised: boolean) => {
    isQueryRaisedRef.current = queryRaised;
  };

  const handleCloseDemoChat = () => {
    onStepEnd();
    isQueryRaisedRef.current = false;
  };

  return (
    <>
      <div className={'relative flex h-[90%] w-full items-center justify-center'}>
        {!isImageLoaded && (
          <div
            className="absolute inset-0 scale-95 
    bg-gray-200 opacity-0 blur-sm
    transition-all duration-500
    ease-in-out hover:scale-100
    hover:opacity-100 hover:blur-none"
          />
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

      <div className="flex h-[10%] flex-1 items-center py-4">
        <DemoQuestions
          isDemoPlaying={DemoPlayingStatus.PLAYING === demoPlayingStatus}
          onRaiseDemoQuery={handleRaiseDemoQuery}
          onCloseDemoChat={handleCloseDemoChat}
        />
      </div>
    </>
  );
};

export default memo(DemoContent);
