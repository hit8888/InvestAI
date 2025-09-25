import { LAYOUT_CONSTANTS } from '../constants';

/**
 * Utility function to get the bottom gap value from CSS variable or fallback to constant
 *
 * This function reads the --breakout-command-bar-bottom CSS variable and provides
 * a fallback to the MIN_BOTTOM_GAP constant when the CSS variable is not available
 * or when running in a non-browser environment.
 *
 * @returns The bottom gap value in pixels
 */
export const getBottomGap = (): number => {
  const { MIN_BOTTOM_GAP } = LAYOUT_CONSTANTS;

  // Use CSS variable for bottom gap if available, fallback to constant
  const bottomGap =
    typeof window !== 'undefined'
      ? parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--breakout-command-bar-bottom') ||
            MIN_BOTTOM_GAP.toString(),
        )
      : MIN_BOTTOM_GAP;

  return bottomGap;
};
