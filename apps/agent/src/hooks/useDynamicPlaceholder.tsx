import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { BottomBarType } from '@meaku/core/types/api/configuration_response';
import { useState, useEffect } from 'react';

const getRandomPlaceholder = (placeholders: string | string[]): string => {
  if (Array.isArray(placeholders)) {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
  return placeholders;
};

interface UseDynamicPlaceholderProps {
  (hasFirstUserMessageBeenSent: boolean): string;
}

const useDynamicPlaceholder: UseDynamicPlaceholderProps = (hasFirstUserMessageBeenSent) => {
  const bottomBarConfig = useUnifiedConfigurationResponseManager().getBottomBarConfig();

  const placeholders: string | string[] = hasFirstUserMessageBeenSent
    ? ((bottomBarConfig?.primary_placeholder as unknown as keyof BottomBarType) ?? ['Have a question? Ask here'])
    : ((bottomBarConfig?.secondary_placeholder as unknown as keyof BottomBarType) ?? ['Have a question? Ask here']);

  const [placeholder, setPlaceholder] = useState<string>(getRandomPlaceholder(placeholders));

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(getRandomPlaceholder(placeholders));
    }, 6000); // Changes every 6 seconds

    return () => clearInterval(interval);
  }, [hasFirstUserMessageBeenSent]);

  return placeholder;
};

export default useDynamicPlaceholder;
