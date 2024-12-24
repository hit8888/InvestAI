import { Dispatch, memo, SetStateAction, useEffect, useRef } from 'react';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { ScriptStepType } from '@meaku/core/types/chat';
import { DemoQuestions } from './DemoQuestions';
import ArtifactControls from '../ArtifactControls';
import { DemoPlayingStatus } from '@meaku/core/types/common';

interface IProps {
  demoDetails: ScriptStepType;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: Dispatch<SetStateAction<DemoPlayingStatus>>;
  onStepEnd: () => void;
}

const DemoContent = ({ demoDetails, demoPlayingStatus, setDemoPlayingStatus, onStepEnd }: IProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isQueryRaisedRef = useRef(false);

  const handleAudioEnd = () => {
    if (isQueryRaisedRef.current) {
      setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      return;
    }
    onStepEnd();
  };

  const handleToggleFullScreen = useMessageStore((state) => state.handleToggleFullScreen);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (audio) {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      } else {
        audio.pause();
        setDemoPlayingStatus(DemoPlayingStatus.PAUSED);
      }
    }
  };

  const handleRestart = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
  };

  useEffect(() => {
    if (!demoDetails?.audio_url) {
      return;
    }
    if (audioRef.current && audioRef.current.src === demoDetails?.audio_url) {
      return;
    }
    setDemoPlayingStatus(DemoPlayingStatus.PLAYING);

    const newAudio = new Audio(demoDetails.audio_url);

    audioRef.current = newAudio;

    newAudio.load();
    newAudio.currentTime = 0;
    newAudio.play().catch((error) => {
      console.error('Error playing audio:', error);
      onStepEnd();
    });
  }, [demoDetails?.audio_url]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnd);

      return () => {
        audioElement.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, [audioRef.current]);

  const handleRaiseDemoQuery = (queryRaised: boolean) => {
    isQueryRaisedRef.current = queryRaised;
  };

  const handleCloseDemoChat = () => {
    onStepEnd();
    isQueryRaisedRef.current = false;
  };

  return (
    <>
      <div className={'relative h-[90%] w-full max-w-full transition-all duration-300 ease-in-out'}>
        <img className="h-full w-full object-cover" src={demoDetails.asset_url} alt={demoDetails.message} />
      </div>
      <ArtifactControls
        isPlaying={DemoPlayingStatus.PLAYING === demoPlayingStatus}
        handlePause={handlePlayPause}
        handleRestart={handleRestart}
        handleToggleFullScreen={handleToggleFullScreen}
      />
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
