import { motion } from 'framer-motion';
import { ACTION_ANIMATION_CONSTANTS, ANIMATION_STYLES, TRANSITION_PRESETS } from '../constants/actionAnimations';

interface ActionShimmerEffectProps {
  visualIndex: number;
}

export const ActionShimmerEffect = ({ visualIndex }: ActionShimmerEffectProps) => {
  const shimmerDelay =
    ACTION_ANIMATION_CONSTANTS.BASE_TOOLTIP_DELAY + visualIndex * ACTION_ANIMATION_CONSTANTS.SHIMMER_STAGGER_INTERVAL;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      style={{ zIndex: ACTION_ANIMATION_CONSTANTS.SHIMMER_Z_INDEX }}
    >
      <motion.div
        className="h-full"
        style={ANIMATION_STYLES.shimmer}
        initial={{ x: -ACTION_ANIMATION_CONSTANTS.SHIMMER_TRAVEL_DISTANCE }}
        animate={{ x: ACTION_ANIMATION_CONSTANTS.SHIMMER_TRAVEL_DISTANCE }}
        transition={{
          ...TRANSITION_PRESETS.shimmer,
          delay: shimmerDelay,
        }}
      />
    </div>
  );
};
