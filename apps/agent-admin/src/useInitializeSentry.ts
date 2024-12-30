import LogRocket from 'logrocket';
import { isProduction } from './utils/common';
import { ENV } from './config/env';
import { useEffect } from 'react';
import { trackError } from './utils/error';

const useInitializeSentry = () => {
  useEffect(() => {
    if (!isProduction) return;

    try {
      LogRocket.init(ENV.VITE_LOGROCKET_APP_ID);
    } catch (error) {
      trackError(error, {
        action: 'initialize_logrocket',
        component: 'App',
      });
    }
  }, []);
};

export { useInitializeSentry };
