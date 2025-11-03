import { useMemo, useState } from 'react';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';

const INACTIVITY_TIMEOUT_DELAY = 5000;

const useNudgeActionCta = () => {
  const { config } = useCommandBarStore();
  const enabledModule = useMemo(
    () => config.command_bar?.modules.find((m) => m.module_configs.hover?.enabled),
    [config.command_bar?.modules],
  );
  const [isDismissed, setIsDismissed] = useState(false);

  const { thresholdReachCount } = useScrollProgress(10);
  const inactivityTimeoutReached = useDelayedEnable(INACTIVITY_TIMEOUT_DELAY);

  const isEnabled =
    !!enabledModule && !isDismissed && (thresholdReachCount > 0 || inactivityTimeoutReached) && !config.session_id;

  return {
    isEnabled,
    disable: () => setIsDismissed(true),
    module: isEnabled ? enabledModule : null,
  };
};

export default useNudgeActionCta;
