import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import { BottomBarType } from '@meaku/core/types/api/configuration_response';

interface UseDynamicPlaceholderProps {
  (hasFirstUserMessageBeenSent: boolean): string;
}

const useDynamicPlaceholder: UseDynamicPlaceholderProps = (hasFirstUserMessageBeenSent) => {
  const bottomBarConfig = useConfigurationApiResponseManager().getBottomBarConfig();

  const placeholders: string | string[] = hasFirstUserMessageBeenSent
    ? ((bottomBarConfig?.primary_placeholder as unknown as keyof BottomBarType) ?? ['Have a question? Ask here'])
    : ((bottomBarConfig?.secondary_placeholder as unknown as keyof BottomBarType) ?? ['Have a question? Ask here']);

  return placeholders;
};

export default useDynamicPlaceholder;
