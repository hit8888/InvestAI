import { useEffect } from 'react';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';

const useHandleAppStateOnUnmount = () => {
  const { handleUpdateSessionData } = useLocalStorageSession();

  useEffect(() => {
    return () => {
      handleUpdateSessionData({ isChatOpen: false });
    };
  }, []);
};

export { useHandleAppStateOnUnmount };
