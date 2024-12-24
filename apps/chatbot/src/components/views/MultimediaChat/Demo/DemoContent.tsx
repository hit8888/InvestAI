import { Dispatch, memo, SetStateAction, useEffect, useRef, useState } from 'react';
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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

  const handleRestart = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    setDemoPlayingStatus(DemoPlayingStatus.PLAYING);
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
      <div className={'relative aspect-video h-[90%] w-full max-w-full'}>
        <img
          className={`h-full w-full object-cover transition-opacity duration-300 ease-in-out ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          src={demoDetails.asset_url}
          alt={demoDetails.message}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
        />
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
