import { useRef } from 'react';
import useSound from '@meaku/core/hooks/useSound';
import messageSound from '../assets/message.wav';

export const useIncomingMessageSound = () => {
  const { play } = useSound(messageSound, 0.35);
  const lastResponseIdRef = useRef<string | null>(null);

  const playSoundForMessage = (responseId: string) => {
    if (lastResponseIdRef.current !== responseId) {
      play();
      lastResponseIdRef.current = responseId;
    }
  };

  return { playSoundForMessage };
};
