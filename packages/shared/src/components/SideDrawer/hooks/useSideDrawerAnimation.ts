import { SideDrawerPosition } from '../types';
import { MotionProps } from 'framer-motion';

/**
 * Framer Motion animation config for SideDrawer slide transitions
 * - Spring physics: stiffness=300, damping=25, mass=0.8
 * - Opacity: 200ms easeInOut
 * - Position: slides from off-screen to target position
 */
interface AnimationConfig {
  initial: MotionProps['initial'];
  animate: MotionProps['animate'];
  exit: MotionProps['exit'];
  transition: {
    opacity: {
      duration: number;
      ease: string;
    };
    default: {
      type: string;
      stiffness: number;
      damping: number;
      mass: number;
      restDelta: number;
      restSpeed: number;
    };
  };
}

/**
 * Generates Framer Motion animation config for SideDrawer
 *
 * Animation behavior:
 * - Right side: slides from left (position.left - width) to position.left
 * - Left side: slides from right (position.left + width) to position.left
 * - Width transitions from target element width to calculated width
 * - Opacity fades 0→1→0 over 200ms
 *
 * @param side - 'left' | 'right' - determines slide direction
 * @param position - SideDrawerPosition with left, top, width, height
 * @param targetRef - HTMLElement ref for width calculation
 * @returns AnimationConfig for motion.div
 */
export const useSideDrawerAnimation = (
  side: 'left' | 'right',
  position: SideDrawerPosition | null,
  targetRef: React.RefObject<HTMLElement | null>,
): AnimationConfig => {
  // Null position fallback - prevents animation errors
  if (!position) {
    return {
      initial: {},
      animate: {},
      exit: {},
      transition: {
        opacity: { duration: 0.2, ease: 'easeInOut' },
        default: {
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          restDelta: 0.01,
          restSpeed: 0.01,
        },
      },
    };
  }

  // Calculate slide start position based on side
  const startLeft = side === 'right' ? position.left - position.width : position.left + position.width;

  // Get target element width for smooth transition
  const targetWidth = targetRef.current?.getBoundingClientRect().width || position.width;

  return {
    initial: {
      left: startLeft,
      top: position.top,
      width: targetWidth,
      height: position.height,
      opacity: 0,
    },
    animate: {
      left: position.left,
      top: position.top,
      width: position.width,
      height: position.height,
      opacity: 1,
    },
    exit: {
      left: startLeft,
      width: targetWidth,
      height: position.height,
      opacity: 0,
    },
    transition: {
      opacity: {
        duration: 0.2,
        ease: 'easeInOut',
      },
      default: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        restDelta: 0.01,
        restSpeed: 0.01,
      },
    },
  };
};
