import { motion } from 'framer-motion';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import CommandBarActions from '../CommandBarActions';
import FeatureContentContainer from '../FeatureContentContainer';
import { Nudge } from '@meaku/shared/features';
import { COMPONENT_TRANSITIONS } from '../../constants/animationTimings';
import { BottomBarTransitionState, BottomBarTransitionActions } from './hooks/useBottomBarTransition';
import { COMMAND_BAR_ANIMATIONS } from './constants';

interface BottomRightRendererProps {
  containerClasses: string;
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

export const BottomRightRenderer = ({
  containerClasses,
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
}: BottomRightRendererProps) => {
  const { isDefaultBarReady, skipInitialTooltips } = transitionState;
  const { handleDefaultBarAnimationComplete } = transitionActions;

  return (
    <motion.div
      className={containerClasses}
      {...COMMAND_BAR_ANIMATIONS.CONTAINER}
      onAnimationComplete={handleDefaultBarAnimationComplete}
    >
      <div key="root-content" className="flex items-end gap-4">
        {/* Nudges positioned based on bottom bar render state */}
        {nudgeEnabled && (
          <motion.div
            key="nudge-right"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              ...COMPONENT_TRANSITIONS.APP_CONTAINER,
              ...COMMAND_BAR_ANIMATIONS.NUDGE.transition,
              delay: 0.1, // Small delay after bottom bar fades out
            }}
          >
            <Nudge activeFeature={activeFeatureModuleType} setActiveFeature={setActiveFeature} />
          </motion.div>
        )}
        <CommandBarActions
          activeFeature={activeFeatureModuleType}
          setActiveFeature={setActiveFeature}
          shouldStartAnimations={isDefaultBarReady && isDynamicConfigStarted && !isDynamicConfigLoading}
          skipInitialTooltips={skipInitialTooltips}
        />
        {activeFeatureModuleType && (
          <FeatureContentContainer
            activeFeature={activeFeatureModuleType}
            setActiveFeature={setActiveFeature}
            isExpanded={isExpanded}
            onClose={onClose}
            onExpand={onExpand}
          />
        )}
      </div>
    </motion.div>
  );
};
