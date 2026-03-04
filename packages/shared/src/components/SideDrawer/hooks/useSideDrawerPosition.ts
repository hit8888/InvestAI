import { useCallback, useState } from 'react';
import { SideDrawerPosition } from '../types';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';

interface UseSideDrawerPositionProps {
  targetRef: React.RefObject<HTMLElement | null>;
  side: 'left' | 'right';
  minWidth: number;
  maxWidth: number;
  offset: number;
  isOpen: boolean;
}

/**
 * Hook to manage the positioning logic for the SideDrawer.
 * Handles responsive positioning, size constraints, and viewport boundaries.
 *
 * @param props Configuration for drawer positioning
 * @returns Current position and function to recalculate position
 *
 * Features:
 * - Responsive mobile/desktop layouts
 * - Smart positioning to avoid viewport overflow
 * - Maintains consistent gaps and margins
 * - Handles dynamic target element resizing
 */
export const useSideDrawerPosition = ({
  targetRef,
  side,
  minWidth,
  maxWidth,
  offset,
  isOpen,
}: UseSideDrawerPositionProps) => {
  const [position, setPosition] = useState<SideDrawerPosition | null>(null);
  const isMobile = useIsMobile();

  const calculatePosition = useCallback(() => {
    if (!targetRef?.current || !isOpen) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Mobile view takes full screen
    if (isMobile) {
      setPosition({
        top: 0,
        left: 0,
        height: viewportHeight,
        width: viewportWidth,
      });
      return;
    }

    // Use target container's height since it already handles viewport constraints
    const minMargin = 12;
    const drawerHeight = targetRect.height;
    const top = targetRect.top;

    // Calculate horizontal position and width
    let left: number;
    let drawerWidth: number;

    const calculateWidth = (availableWidth: number) => {
      return Math.min(Math.max(minWidth, availableWidth), maxWidth);
    };

    if (side === 'right') {
      // Position to the right of target with consistent gap
      const gap = minMargin + offset;
      const availableWidth = viewportWidth - targetRect.right - gap;
      drawerWidth = calculateWidth(availableWidth);
      left = targetRect.right + gap;

      // Handle overflow
      if (left + drawerWidth > viewportWidth - minMargin) {
        // Try positioning to the left if there's more space
        const leftSideSpace = targetRect.left - gap;
        if (leftSideSpace > availableWidth) {
          drawerWidth = calculateWidth(leftSideSpace);
          left = targetRect.left - drawerWidth - gap;
        } else {
          // Stick to right side but adjust width
          left = viewportWidth - drawerWidth - minMargin;
        }
      }
    } else {
      // Position to the left of target with consistent gap
      const gap = minMargin + offset;
      const availableWidth = targetRect.left - gap;
      drawerWidth = calculateWidth(availableWidth);
      left = targetRect.left - drawerWidth - gap;

      // Handle overflow
      if (left < minMargin) {
        // Try positioning to the right if there's more space
        const rightSideSpace = viewportWidth - targetRect.right - gap;
        if (rightSideSpace > availableWidth) {
          drawerWidth = calculateWidth(rightSideSpace);
          left = targetRect.right + gap;
        } else {
          // Stick to left side but adjust width
          left = minMargin;
          drawerWidth = Math.max(minWidth, targetRect.left - minMargin * 2);
        }
      }
    }

    setPosition({
      top,
      left,
      height: drawerHeight,
      width: drawerWidth,
    });
  }, [targetRef, side, offset, maxWidth, minWidth, isMobile, isOpen]);

  return {
    position,
    calculatePosition,
  };
};
