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
        {/* Nudges always appear on the right bottom */}
        {nudgeEnabled && (
          <motion.div
            {...COMMAND_BAR_ANIMATIONS.NUDGE}
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
          shouldStartAnimations={isDefaultBarReady}
          skipInitialTooltips={skipInitialTooltips}
        />
        {activeFeatureModuleType && (
          <FeatureContentContainer
            key={activeFeatureModuleType}
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
