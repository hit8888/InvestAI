import { useEffect, useState } from 'react';

type IProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  duration: number;
  isFirstSlide: boolean;
};

const useHalfDurationAudio = ({ audioRef, duration, isFirstSlide }: IProps) => {
  const [hasHalfDurationPassed, setHasHalfDurationPassed] = useState(isFirstSlide ? false : true);
  const [hasOneByFifthDurationPassed, setHasOneByFifthDurationPassed] = useState(isFirstSlide ? false : true);
  useEffect(() => {
    if (!audioRef.current || !duration || !isFirstSlide) return;

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;

      if (!hasOneByFifthDurationPassed && currentTime >= duration / 5) {
        setHasOneByFifthDurationPassed(true);
      }

      if (!hasHalfDurationPassed && currentTime >= duration / 2) {
        setHasHalfDurationPassed(true);
      }

      // Remove listener only if both values are set
      if (hasOneByFifthDurationPassed && hasHalfDurationPassed) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef, duration, hasOneByFifthDurationPassed, hasHalfDurationPassed]);

  return {
    hasHalfDurationPassed,
    hasOneByFifthDurationPassed,
  };
};

export default useHalfDurationAudio;
