import { Dispatch, memo, SetStateAction, useEffect, useRef } from 'react';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';
import { useMessageStore } from '../../../../stores/useMessageStore';
import ArtifactControls from '../ArtifactControls';
import { ScriptStepType } from '@meaku/core/types/chat';
import { DemoQuestions } from './DemoQuestions';

interface IProps {
  demoDetails: ScriptStepType;
  onDemoFinish: () => void;
  isDemoPlaying: boolean;
  setIsDemoPlaying: Dispatch<SetStateAction<boolean>>;
  handleGetNextDemoFrame: () => void;
}

const DemoContent = ({
  demoDetails,
  isDemoPlaying,
  setIsDemoPlaying,
  handleGetNextDemoFrame,
  onDemoFinish,
}: IProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioEnd = () => {
    if (demoDetails.is_end) {
      onDemoFinish();
      return;
    }
    handleGetNextDemoFrame();
  };

  const handleToggleFullScreen = useMessageStore((state) => state.handleToggleFullScreen);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    setIsDemoPlaying((prevState) => !prevState);

    if (audio) {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsDemoPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      } else {
        audio.pause();
      }
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsDemoPlaying(true);
  };

  useEffect(() => {
    setIsDemoPlaying(true);

    const newAudio = new Audio(demoDetails.audio_url);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = newAudio;

    newAudio.load();
    newAudio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });

    return () => {
      newAudio.pause();
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnd);

      return () => {
        audioElement.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, []);

  return (
    <>
      <div className={'relative h-[90%] w-full max-w-full'}>
        <img className="h-full w-full object-contain" src={demoDetails.asset_url} alt={demoDetails.message} />
        <div
          className={cn('absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/30', {
            'opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100': isDemoPlaying,
          })}
          onClick={handlePlayPause}
        >
          {isDemoPlaying ? (
            <PauseIcon className="fill-white text-white" size={60} />
          ) : (
            <PlayIcon className="fill-white text-white" size={60} />
          )}
        </div>

        <ArtifactControls
          isPlaying={isDemoPlaying}
          handlePause={handlePlayPause}
          handleRestart={handleRestart}
          handleToggleFullScreen={handleToggleFullScreen}
        />
      </div>
      <div className="h-10% flex flex-1 items-center py-4">
        <DemoQuestions isDemoPlaying={isDemoPlaying} />
      </div>
    </>
  );
};

export default memo(DemoContent);
