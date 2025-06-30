import { useEffect, useState } from 'react';

/**
 * Returns a force-enable boolean that becomes true after the specified delay
 * when disabled is true, or immediately when disabled is false.
 */
export default function useForceEnableDelay(disabled: boolean, delayMs = 5000): boolean {
  const [forceEnable, setForceEnable] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (disabled) {
      setForceEnable(false);
      timer = setTimeout(() => {
        setForceEnable(true);
      }, delayMs);
    } else {
      setForceEnable(true);
    }
    return () => clearTimeout(timer);
  }, [disabled, delayMs]);

  return forceEnable;
}
