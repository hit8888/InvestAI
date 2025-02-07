import { useEffect, useState } from 'react';
import { RAISE_HAND_BUTTON_APPEARANCE_THRESHOLD_IN_SECONDS } from '../constants/chat';

type IProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  duration: number;
  isFirstSlide: boolean;
};

const useHalfDurationAudio = ({ audioRef, duration, isFirstSlide }: IProps) => {
  const [hasTimeDurationPassed, setHasTimeDurationPassed] = useState(isFirstSlide ? false : true);
  const [hasOneByFifthDurationPassed, setHasOneByFifthDurationPassed] = useState(isFirstSlide ? false : true);
  useEffect(() => {
    if (!audioRef.current || !duration || !isFirstSlide) return;

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;

      if (!hasOneByFifthDurationPassed && currentTime >= duration / 5) {
        setHasOneByFifthDurationPassed(true);
      }

      if (!hasTimeDurationPassed && duration - currentTime <= RAISE_HAND_BUTTON_APPEARANCE_THRESHOLD_IN_SECONDS) {
        setHasTimeDurationPassed(true);
      }

      // Remove listener only if both values are set
      if (hasOneByFifthDurationPassed && hasTimeDurationPassed) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef, duration, hasOneByFifthDurationPassed, hasTimeDurationPassed]);

  return {
    hasTimeDurationPassed,
    hasOneByFifthDurationPassed,
  };
};

export default useHalfDurationAudio;
