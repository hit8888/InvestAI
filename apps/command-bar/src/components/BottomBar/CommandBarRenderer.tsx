import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { BottomBarTransitionState, BottomBarTransitionActions } from './hooks/useBottomBarTransition';
import { CommandBarLayoutResult } from './hooks/useCommandBarLayout';
import { BottomCenterRenderer } from './BottomCenterRenderer';
import { BottomRightRenderer } from './BottomRightRenderer';

interface CommandBarRendererProps {
  layout: CommandBarLayoutResult;
  transitionState: BottomBarTransitionState;
  transitionActions: BottomBarTransitionActions;
  activeFeatureModuleType: CommandBarModuleType | null;
  setActiveFeature: (feature: CommandBarModuleType | null) => void;
  nudgeEnabled: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onExpand: () => void;
  isDynamicConfigLoading?: boolean;
  isDynamicConfigStarted?: boolean;
}

export const CommandBarRenderer = ({
  layout,
  transitionState,
  transitionActions,
  activeFeatureModuleType,
  setActiveFeature,
  nudgeEnabled,
  isExpanded,
  onClose,
  onExpand,
  isDynamicConfigLoading = false,
  isDynamicConfigStarted = false,
}: CommandBarRendererProps) => {
  const { isBottomCenter, containerClasses } = layout;

  const commonProps = {
    transitionState,
    transitionActions,
    activeFeatureModuleType,
    setActiveFeature,
    nudgeEnabled,
    isExpanded,
    onClose,
    onExpand,
    isDynamicConfigLoading,
    isDynamicConfigStarted,
  };

  if (isBottomCenter) {
    return <BottomCenterRenderer {...commonProps} />;
  }

  return <BottomRightRenderer {...commonProps} containerClasses={containerClasses} />;
};
