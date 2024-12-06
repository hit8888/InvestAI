import { useEffect } from 'react';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';

const useHandleAppStateOnUnmount = () => {
  const { handleUpdateSessionData } = useLocalStorageSession();

  useEffect(() => {
    return () => {
      handleUpdateSessionData({ isChatOpen: false });
      const payload = {
        chatOpen: false,
        tooltipOpen: false,
      };

      window.parent.postMessage(payload, '*');
    };
  }, []);
};

export { useHandleAppStateOnUnmount };
