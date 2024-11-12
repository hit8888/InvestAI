// withWhiteLabelConfig.tsx
import React, { useCallback } from 'react';
import { handleColorConfig } from '../utils/common';
import useUnifiedConfigurationResponseManager from './shared/hooks/useUnifiedConfigurationResponseManager';

export const withWhiteLabelConfig = (WrappedComponent: React.ComponentType) => {
  return function WithWhiteLabelConfigComponent() {
    const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
    const styleConfig = unifiedConfigurationResponseManager.getStyleConfig();

    const applyConfig = useCallback(() => {
      if (styleConfig) {
        handleColorConfig(styleConfig);
        applyConfig();
      }
    }, [styleConfig]);

    return <WrappedComponent />;
  };
};
