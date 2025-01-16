// withWhiteLabelConfig.tsx
import React, { useEffect } from 'react';
import { handleColorConfig } from '../utils/common';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';

export const withWhiteLabelConfig = (WrappedComponent: React.ComponentType) => {
  return function WithWhiteLabelConfigComponent() {
    const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
    const rawStyleConfig = unifiedConfigurationResponseManager.getStyleConfig();

    // Filter out show_banner from styleConfig
    const styleConfig = Object.fromEntries(Object.entries(rawStyleConfig).filter(([key]) => key !== 'show_banner'));

    useEffect(() => {
      handleColorConfig(styleConfig);
    }, [styleConfig]);

    return <WrappedComponent />;
  };
};
