import { useEffect } from 'react';
import { handleColorConfig } from '../../../utils/common';
import useUnifiedConfigurationResponseManager from './useUnifiedConfigurationResponseManager';

export const useApplyWhiteLabelConfig = () => {
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  useEffect(() => {
    const styleConfig = unifiedConfigurationResponseManager.getStyleConfig();
    handleColorConfig(styleConfig);
  }, [unifiedConfigurationResponseManager]);
};
