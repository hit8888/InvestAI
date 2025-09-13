import { useMemo } from 'react';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { MODULE_CONFIG, BASE_STYLES } from '../constants';
import { ModulePosition } from './useModulePositioning';

export interface ModuleStyles {
  bottom: number;
  transform: string;
  maxHeight: number;
}

export interface InnerModuleStyles {
  maxHeight: number;
  width: string | number;
  overflowY?: 'auto' | 'hidden' | 'scroll';
  overflowX?: 'auto' | 'hidden' | 'scroll';
  [key: string]: string | number | undefined;
}

/**
 * Custom hook for generating module-specific styles
 *
 * Handles:
 * - Base positioning styles (bottom, transform, maxHeight)
 * - Module-specific style overrides
 * - Mobile vs desktop style differences
 *
 * @param activeFeature - The active module type
 * @param position - Calculated position from useModulePositioning
 * @returns Base styles for the module container
 */
export const useModuleStyles = (
  activeFeature: CommandBarModuleType | null,
  position: ModulePosition | null,
): ModuleStyles | null => {
  return useMemo(() => {
    if (!activeFeature || !position) return null;

    return {
      bottom: position.bottom,
      transform: position.transform,
      maxHeight: position.maxHeight,
    };
  }, [activeFeature, position]);
};

/**
 * Custom hook for generating inner module styles
 *
 * Handles:
 * - Module-specific inner container styles
 * - Width calculations based on module type and expansion state
 * - Overflow behavior for scrollable content
 *
 * @param activeFeature - The active module type
 * @param position - Calculated position from useModulePositioning
 * @param isExpanded - Whether the module is in expanded state
 * @param isMobile - Whether the device is mobile
 * @returns Inner container styles
 */
export const useInnerModuleStyles = (
  activeFeature: CommandBarModuleType | null,
  position: ModulePosition | null,
  isExpanded: boolean,
  isMobile: boolean,
): InnerModuleStyles | null => {
  return useMemo(() => {
    if (!activeFeature || !position) return null;

    const moduleConfig = MODULE_CONFIG[activeFeature];
    const baseStyles: InnerModuleStyles = {
      maxHeight: position.maxHeight,
      width: isMobile ? '100%' : isExpanded ? moduleConfig.expandedWidth : moduleConfig.width,
    };

    // Apply module-specific inner styles
    return {
      ...baseStyles,
      ...moduleConfig.innerStyles,
    };
  }, [activeFeature, position, isExpanded, isMobile]);
};

/**
 * Get base layout styles for mobile or desktop
 *
 * @param isMobile - Whether the device is mobile
 * @returns Base layout styles
 */
export const getBaseLayoutStyles = (isMobile: boolean) => {
  return isMobile ? BASE_STYLES.mobile : BASE_STYLES.desktop;
};
