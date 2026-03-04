import { cn } from '@neuraltrade/saral';
import React from 'react';
import { SideDrawerPosition } from './types';

interface SideDrawerContentProps {
  children: React.ReactNode;
  contentClassName?: string;
  position: SideDrawerPosition;
}

/**
 * Internal component for rendering the side drawer's content.
 * Handles content layout, overflow, and width transitions.
 *
 * Features:
 * - Maintains content width during animations
 * - Handles overflow scrolling
 * - Preserves content position during transitions
 */
export const SideDrawerContent: React.FC<SideDrawerContentProps> = ({ children, contentClassName, position }) => {
  return (
    <div
      className={cn('relative flex h-full flex-col overflow-hidden', contentClassName)}
      style={{
        width: position.width,
        minWidth: position.width,
      }}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
};
