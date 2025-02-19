// withWhiteLabelConfig.tsx
import React, { useEffect } from 'react';
import { handleColorConfig } from '../utils/common';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';

export const withWhiteLabelConfig = (WrappedComponent: React.ComponentType) => {
  return function WithWhiteLabelConfigComponent() {
    const configurationApiResponseManager = useConfigurationApiResponseManager();
    const styleConfig = configurationApiResponseManager.getStyleConfig();

    useEffect(() => {
      handleColorConfig(styleConfig);
    }, [styleConfig]);

    return <WrappedComponent />;
  };
};
