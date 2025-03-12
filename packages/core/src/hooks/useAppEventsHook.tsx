import { useEffect } from 'react';
import useLocalStorageSession from './useLocalStorageSession.tsx';

export const useAppEventsHook = (callback: (event: MessageEvent) => void) => {
  const {
    sessionData: { sessionId },
  } = useLocalStorageSession();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      callback(event);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [callback]);

  // Send ready message to parent when component mounts
  useEffect(() => {
    window.parent.postMessage({ type: 'IFRAME_READY', sessionId: sessionId }, '*');
  }, [sessionId]);
};
