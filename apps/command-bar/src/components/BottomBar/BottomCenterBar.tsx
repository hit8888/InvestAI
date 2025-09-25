import React from 'react';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { MessageEventType } from '@meaku/shared/types/message';

// Components
import BottomBarContainer from './BottomBarContainer';

export interface BottomCenterBarProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (buttonType: CommandBarModuleType | null) => void;
  actionButtonSize?: number;
  isDynamicConfigLoading?: boolean;
  isDynamicConfigStarted?: boolean;
  onSwitchToDefault?: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void;
}

const BottomCenterBar: React.FC<BottomCenterBarProps> = (props) => {
  return <BottomBarContainer {...props} />;
};

export default BottomCenterBar;
