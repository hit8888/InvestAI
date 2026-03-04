import { useMemo, useEffect, useRef } from 'react';
import { cn } from '@neuraltrade/saral';
import { LAYOUT_PREFERENCE_CONFIG } from '@neuraltrade/core/constants/layout-preference';
import { useDevice } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import { useLayoutPreference } from '../../../hooks/useLayoutPreference';

export interface CommandBarLayoutConfig {
  position: string;
  settings: { position?: string };
  ui: { position?: string };
  isFirstTimeVisitor: boolean;
}

export interface CommandBarLayoutResult {
  finalPosition: string;
  containerClasses: string;
  isBottomCenter: boolean;
  isBottomRight: boolean;
}

export const useCommandBarLayout = (config: CommandBarLayoutConfig): CommandBarLayoutResult => {
  const { position = LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT, settings, isFirstTimeVisitor } = config;
  const configPosition = settings.position || position;
  const prevConfigPosition = useRef<string | null>(null);

  const { clearPreference, determineFinalLayout } = useLayoutPreference();

  // Clear layout preference only when config position actually changes or is first time visitor
  useEffect(() => {
    if (isFirstTimeVisitor || (prevConfigPosition.current !== null && prevConfigPosition.current !== configPosition)) {
      clearPreference();
    }
    prevConfigPosition.current = configPosition;
  }, [configPosition, clearPreference, isFirstTimeVisitor]);

  // UPDATED: Allow bottom_center on tablet and desktop (≥576px)
  // Only force bottom_right on truly mobile devices (<576px)
  // On small mobile screens, bottom bar takes too much screen real estate
  const { isMobile } = useDevice();
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
