import { useMemo } from 'react';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { LAYOUT_CONSTANTS, MODULE_CONFIG } from '../constants';
import { getBottomGap } from '../utils';

export interface ModulePosition {
  bottom: number;
  maxHeight: number;
  transform: string;
}

/**
 * Custom hook for calculating module positioning and dimensions
 *
 * Handles:
 * - Available height calculation based on screen dimensions
 * - Module-specific positioning logic
 * - Mobile vs desktop positioning differences
 *
 * @param activeFeature - The active module type
 * @param screenHeight - Current screen height
 * @param isMobile - Whether the device is mobile
 * @returns Calculated position and dimensions for the module
 */
export const useModulePositioning = (
  activeFeature: CommandBarModuleType | null,
  screenHeight: number,
  isMobile: boolean,
): ModulePosition | null => {
  return useMemo(() => {
    if (!activeFeature) return null;

    const { MIN_TOP_GAP } = LAYOUT_CONSTANTS;

    // Use shared utility to get bottom gap from CSS variable or fallback
    const bottomGap = getBottomGap();

    const availableHeight = screenHeight - MIN_TOP_GAP - bottomGap;

    // Mobile positioning - simplified bottom alignment
    if (isMobile) {
      return {
        bottom: bottomGap,
        maxHeight: availableHeight,
        transform: 'translateY(0)',
      };
    }

    // Desktop positioning - module-specific logic
    const moduleConfig = MODULE_CONFIG[activeFeature];

    if (activeFeature === 'VIDEO_LIBRARY' || activeFeature === 'DEMO_LIBRARY') {
      return {
        bottom: bottomGap,
        maxHeight: availableHeight, // Always fit within viewport
        transform: 'translateY(0)',
      };
    }

    // Default positioning for other modules (ASK_AI, etc.)
    const maxModuleHeight = Math.min(availableHeight, moduleConfig.maxHeight as number);

    return {
      bottom: bottomGap,
      maxHeight: maxModuleHeight,
      transform: 'translateY(0)',
    };
  }, [activeFeature, screenHeight, isMobile]);
};

/**
 * Utility function to get the maximum available height for any module
 *
 * @param screenHeight - Current screen height
 * @returns Maximum available height considering gaps
 */
export const getMaxAvailableHeight = (screenHeight: number): number => {
  const { MIN_TOP_GAP } = LAYOUT_CONSTANTS;

  // Use shared utility to get bottom gap from CSS variable or fallback
  const bottomGap = getBottomGap();

  return screenHeight - MIN_TOP_GAP - bottomGap;
};
