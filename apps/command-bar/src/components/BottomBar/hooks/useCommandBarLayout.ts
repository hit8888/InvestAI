import { useMemo } from 'react';
import { cn } from '@meaku/saral';

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
  const { position = 'bottom_right', settings } = config;
  const finalPosition = settings.position || position;

  const containerClasses = useMemo(() => {
    return cn('fixed z-command-bar', finalPosition === 'bottom_left' ? 'left-4 bottom-4' : 'right-4 bottom-4');
  }, [finalPosition]);

  const isBottomCenter = finalPosition === 'bottom_center';
  const isBottomRight = finalPosition === 'bottom_right';

  return {
    finalPosition,
    containerClasses,
    isBottomCenter,
    isBottomRight,
  };
};
