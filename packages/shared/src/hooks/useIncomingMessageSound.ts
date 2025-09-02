import { useRef } from 'react';

import useSound from '@meaku/core/hooks/useSound';
import messageSound from '../assets/message.wav';
import { Message } from '../types/message';

const MESSAGE_SOUND_EXCLUDE_LIST = ['ADMIN_TYPING'];
const SOUND_VOLUME = 0.35;

export const useIncomingMessageSound = () => {
  const { play } = useSound(messageSound, SOUND_VOLUME);
  const lastResponseIdRef = useRef<string | null>(null);

  const playSoundForMessage = (message: Message) => {
    if (
      MESSAGE_SOUND_EXCLUDE_LIST.includes(message.event_type) ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      MESSAGE_SOUND_EXCLUDE_LIST.includes((message as any).message?.event_type)
    ) {
      return;
    }

    if (lastResponseIdRef.current !== message.response_id) {
      play();
      lastResponseIdRef.current = message.response_id;
    }
  };

  return { playSoundForMessage };
};
