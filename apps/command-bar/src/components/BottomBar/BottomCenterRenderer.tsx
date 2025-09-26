import { motion } from 'framer-motion';
import { cn } from '@meaku/saral';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';
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

  // Get screen width for responsive nudge positioning
  const { screenWidth } = useScreenSize();

  // Check if bottom bar is currently rendered
  const isBottomBarRendered = !shouldUnmountBottomBar && isDynamicConfigStarted && !isDynamicConfigLoading;

  // Move nudge up only when bottom bar is rendered AND device width is below breakpoint
  // Above the breakpoint, there's enough space to avoid overlap without offset
  const shouldMoveNudgeUp = isBottomBarRendered && screenWidth < COMMAND_BAR_ANIMATIONS.NUDGE.OVERLAP_BREAKPOINT;

  const { handleSwitchToDefault, handleDefaultBarAnimationComplete } = transitionActions;

  return (
    <>
      {/* Bottom center bar - only shown if not unmounted yet AND dynamic API is ready */}
      {!shouldUnmountBottomBar && isDynamicConfigStarted && !isDynamicConfigLoading && (
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
        {/* Nudges positioned based on bottom bar render state */}
        {nudgeEnabled && (
          <motion.div
            key="nudge-center"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: shouldMoveNudgeUp ? COMMAND_BAR_ANIMATIONS.NUDGE.Y_OFFSET : 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: shouldMoveNudgeUp ? COMMAND_BAR_ANIMATIONS.NUDGE.Y_OFFSET : 0,
            }}
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
