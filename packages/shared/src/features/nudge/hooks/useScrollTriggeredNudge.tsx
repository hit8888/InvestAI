import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';
import { useCallback, useState } from 'react';

const useScrollTriggeredNudge = () => {
  const { settings } = useCommandBarStore();
  const [isEnabled, setIsEnabled] = useState(settings.tenant_id === 'breakout');
  const { thresholdReachCount } = useScrollProgress();

  const disable = useCallback(() => {
    setIsEnabled(false);
  }, []);

  return { isEnabled: isEnabled && thresholdReachCount > 0, disable };
};

export default useScrollTriggeredNudge;
