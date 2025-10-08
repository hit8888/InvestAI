import { useMemo, useEffect, useRef } from 'react';
import { cn } from '@meaku/saral';
import { LAYOUT_PREFERENCE_CONFIG } from '@meaku/core/constants/layout-preference';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { useLayoutPreference } from '../../../hooks/useLayoutPreference';

export interface CommandBarLayoutConfig {
  position: string;
  settings: { position?: string };
  ui: { position?: string };
}

export interface CommandBarLayoutResult {
  finalPosition: string;
  containerClasses: string;
  isBottomCenter: boolean;
  isBottomRight: boolean;
}

export const useCommandBarLayout = (config: CommandBarLayoutConfig): CommandBarLayoutResult => {
  const { position = LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT, settings } = config;
  const configPosition = settings.position || position;
  const prevConfigPosition = useRef<string | null>(null);
  const isMobile = useIsMobile();

  const { clearPreference, determineFinalLayout } = useLayoutPreference();

  // Clear layout preference only when config position actually changes
  useEffect(() => {
    if (prevConfigPosition.current !== null && prevConfigPosition.current !== configPosition) {
      clearPreference();
    }
    prevConfigPosition.current = configPosition;
  }, [configPosition, clearPreference]);

  // On mobile, always use bottom_right layout regardless of backend configuration
  // Bottom bar takes too much screen real estate on mobile devices
  // See COMMAND_BAR_ANIMATIONS.LAYOUT.MOBILE_FORCE_BOTTOM_RIGHT for configuration
  const finalPosition = isMobile ? LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT : determineFinalLayout(configPosition);

  const containerClasses = useMemo(() => {
    return cn(
      'fixed z-root command-bar-positioned',
      finalPosition === LAYOUT_PREFERENCE_CONFIG.CENTER_LAYOUT
        ? 'left-1/2 transform -translate-x-1/2'
        : 'right-root-right-offset',
      'bottom-root-bottom-offset',
    );
  }, [finalPosition]);

  const isBottomCenter = finalPosition === LAYOUT_PREFERENCE_CONFIG.CENTER_LAYOUT;
  const isBottomRight = finalPosition === LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT;

  return {
    finalPosition,
    containerClasses,
    isBottomCenter,
    isBottomRight,
  };
};
