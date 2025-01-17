// withWhiteLabelConfig.tsx
import React, { useEffect } from 'react';
import { handleColorConfig } from '../utils/common';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';

export const withWhiteLabelConfig = (WrappedComponent: React.ComponentType) => {
  return function WithWhiteLabelConfigComponent() {
    const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
    const styleConfig = unifiedConfigurationResponseManager.getStyleConfig();

    useEffect(() => {
      handleColorConfig(styleConfig);
    }, [styleConfig]);

    return <WrappedComponent />;
  };
};
