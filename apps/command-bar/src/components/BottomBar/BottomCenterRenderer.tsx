import { motion } from 'framer-motion';
import { cn } from '@meaku/saral';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { BottomCenterBar } from './';
import CommandBarActions from '../CommandBarActions';
import FeatureContentContainer from '../FeatureContentContainer';
import { Nudge } from '@meaku/shared/features';
import { COMPONENT_TRANSITIONS } from '../../constants/animationTimings';
import { BottomBarTransitionState, BottomBarTransitionActions } from './hooks/useBottomBarTransition';
import { COMMAND_BAR_ANIMATIONS } from './constants';

interface BottomCenterRendererProps {
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

export const BottomCenterRenderer = ({
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
}: BottomCenterRendererProps) => {
  const { hasInteracted, shouldUnmountBottomBar, shouldShowDefaultBar, isDefaultBarReady, skipInitialTooltips } =
    transitionState;

  const { handleSwitchToDefault, handleDefaultBarAnimationComplete } = transitionActions;

  return (
    <>
      {/* Bottom center bar - only shown if not unmounted yet */}
      {!shouldUnmountBottomBar && (
        <BottomCenterBar
          activeFeature={activeFeatureModuleType}
          setActiveFeature={setActiveFeature}
          actionButtonSize={42}
          isDynamicConfigLoading={isDynamicConfigLoading}
          isDynamicConfigStarted={isDynamicConfigStarted}
          onSwitchToDefault={handleSwitchToDefault}
        />
      )}

      {/* Default bar - positioned behind bottom bar, completely hidden until bottom bar exits */}
      <div
        key="root-content"
        className="command-bar-positioned fixed bottom-[var(--breakout-command-bar-bottom)] right-[var(--breakout-command-bar-right)] z-command-bar flex items-end gap-4"
      >
        {/* Nudges always appear on the right bottom */}
        {nudgeEnabled && (
          <motion.div
            key="nudge-center"
            {...COMMAND_BAR_ANIMATIONS.NUDGE}
            transition={{
              ...COMPONENT_TRANSITIONS.APP_CONTAINER,
              ...COMMAND_BAR_ANIMATIONS.NUDGE.transition,
              delay: hasInteracted ? 0.8 : 0, // Wait for bottom bar exit animation when transitioning
            }}
          >
            <Nudge activeFeature={activeFeatureModuleType} setActiveFeature={setActiveFeature} />
          </motion.div>
        )}

        <motion.div
          className={cn(shouldShowDefaultBar ? 'pointer-events-auto' : 'pointer-events-none')}
          initial={{
            width: shouldShowDefaultBar ? 'auto' : '0px',
            opacity: shouldShowDefaultBar ? 1 : 0,
          }}
          animate={{
            width: shouldShowDefaultBar ? 'auto' : '0px',
            opacity: shouldShowDefaultBar ? 1 : 0,
          }}
          transition={{
            width: shouldShowDefaultBar
              ? COMMAND_BAR_ANIMATIONS.DEFAULT_BAR_ENTRY.width
              : COMMAND_BAR_ANIMATIONS.DEFAULT_BAR_EXIT.width,
            opacity: shouldShowDefaultBar
              ? COMMAND_BAR_ANIMATIONS.DEFAULT_BAR_ENTRY.opacity
              : COMMAND_BAR_ANIMATIONS.DEFAULT_BAR_EXIT.opacity,
          }}
          onAnimationComplete={handleDefaultBarAnimationComplete}
        >
          <CommandBarActions
            activeFeature={activeFeatureModuleType}
            setActiveFeature={setActiveFeature}
            shouldStartAnimations={hasInteracted && isDefaultBarReady}
            skipInitialTooltips={skipInitialTooltips}
          />
        </motion.div>
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
    </>
  );
};
