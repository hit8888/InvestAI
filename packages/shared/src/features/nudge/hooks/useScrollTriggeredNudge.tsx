import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';
import { useCallback, useState } from 'react';
import { checkIfSubmissionEventsPresent } from '../../../utils/common';

const useScrollTriggeredNudge = () => {
  const { settings, messages } = useCommandBarStore();
  const [isEnabled, setIsEnabled] = useState(() => {
    return settings.tenant_id === 'breakout';
  });
  const { hasReachedThreshold } = useScrollProgress();

  const isBookingActionPending = checkIfSubmissionEventsPresent(messages ?? []);

  const disable = useCallback(() => {
    setIsEnabled(false);
  }, []);

  return { isEnabled: isEnabled && hasReachedThreshold && isBookingActionPending, disable };
};

export default useScrollTriggeredNudge;
