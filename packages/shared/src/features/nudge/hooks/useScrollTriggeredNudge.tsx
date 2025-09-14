import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';
import { useState } from 'react';

const useScrollTriggeredNudge = () => {
  const { settings } = useCommandBarStore();
  const [isEnabled, setIsEnabled] = useState(settings.tenant_id === 'breakout');
  const { thresholdReachCount } = useScrollProgress();

  const toggleEnabled = () => {
    setIsEnabled((prev) => !prev);
  };

  return { isEnabled: isEnabled && thresholdReachCount > 0, toggleEnabled };
};

export default useScrollTriggeredNudge;
