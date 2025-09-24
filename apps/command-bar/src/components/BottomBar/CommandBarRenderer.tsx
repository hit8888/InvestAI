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
  };

  if (isBottomCenter) {
    return <BottomCenterRenderer {...commonProps} />;
  }

  return <BottomRightRenderer {...commonProps} containerClasses={containerClasses} />;
};
