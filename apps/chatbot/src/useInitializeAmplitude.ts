import * as amplitude from '@amplitude/analytics-browser';
import { useEffect } from 'react';
import { isProduction } from './utils/common';
import { ENV } from './config/env';
import { trackError } from './utils/error';

const useInitializeAmplitude = () => {
  useEffect(() => {
    if (!isProduction) return;

    try {
      amplitude.init(ENV.VITE_AMPLITUDE_API_KEY, {
        autocapture: true,
      });
    } catch (error) {
      trackError(error, {
        action: 'initialize_amplitude',
        component: 'App',
      });
    }
  }, []);
};

export { useInitializeAmplitude };
