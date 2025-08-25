import React, { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from './utils';

export interface SideDrawerProps {
  isOpen: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  animationDuration?: number;
  offset?: number; // Offset from the target element
  maxWidth?: number; // Maximum width for the drawer
  minWidth?: number; // Minimum width for the drawer
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  targetRef,
  children,
  side = 'right',
  className,
  contentClassName,
  animationDuration = 300,
  offset = 0,
  maxWidth = 800, // Default max width for media display
  minWidth = 400, // Increased minimum width for better usability
}) => {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; height: number; width: number } | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!targetRef?.current) {
      return;
    }

    const targetRect = targetRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Use maximum available height, leaving some margin for better UX
    const maxDrawerHeight = viewportHeight - 32; // 16px margin top and bottom
    const drawerHeight = Math.min(targetRect.height - 124, maxDrawerHeight);

    // Align drawer bottom with target element bottom, but ensure it fits in viewport
    let top = targetRect.bottom - drawerHeight;

    // Ensure drawer doesn't go below viewport
    const maxTop = viewportHeight - drawerHeight;
    if (top > maxTop) {
      top = maxTop;
    }

    // Ensure drawer doesn't go above viewport
    if (top < 16) {
      top = 16;
    }

    // Calculate left position and width based on side and viewport constraints
    let left: number;
    let drawerWidth: number;

    if (side === 'right') {
      // For right side drawer - take maximum available space
      const availableWidth = viewportWidth - targetRect.right - 16; // Available space to the right

      // Use maximum available width, but respect maxWidth prop
      drawerWidth = Math.max(minWidth, Math.min(maxWidth, availableWidth));

      // Position drawer to the right of the target element with 16px gap
      left = targetRect.right + 16 + offset;

      // Ensure drawer doesn't go beyond viewport right edge
      if (left + drawerWidth > viewportWidth) {
        left = viewportWidth - drawerWidth - 16;
      }
    } else {
      // For left side drawer - take maximum available space
      const availableWidth = targetRect.left - 16; // Available space to the left

      // Use maximum available width, but respect maxWidth prop
      drawerWidth = Math.max(minWidth, Math.min(maxWidth, availableWidth));

      // Position drawer to the left of the target element with 16px gap
      left = targetRect.left - drawerWidth - 16 - offset;

      // Ensure drawer doesn't go beyond viewport left edge
      if (left < 16) {
        left = 16;
        // Recalculate width to fit within viewport
        drawerWidth = Math.max(minWidth, targetRect.left - left - 16);
      }
    }

    const newPosition = {
      top,
      left,
      height: Math.min(drawerHeight, viewportHeight - top - 16), // Ensure we don't exceed viewport
      width: drawerWidth,
    };
    setPosition(newPosition);
  }, [targetRef, side, offset, maxWidth, minWidth]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (targetRef?.current) {
      calculatePosition();

      // Recalculate position on window resize
      const handleResize = () => calculatePosition();
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [targetRef, calculatePosition]);

  // Recalculate position every time drawer opens to account for targetRef changes
  useEffect(() => {
    if (isOpen && targetRef?.current) {
      calculatePosition();
    }
  }, [isOpen, targetRef, calculatePosition]);

  // Watch for targetRef size changes while drawer is open
  useEffect(() => {
    if (isOpen && targetRef?.current) {
      const resizeObserver = new ResizeObserver(() => {
        calculatePosition();
      });

      resizeObserver.observe(targetRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isOpen, targetRef, calculatePosition]);

  const getTransformValue = () => {
    if (side === 'right') {
      return isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[20px] opacity-0';
    }
    return isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[20px] opacity-0';
  };

  const getPositionStyle = () => {
    if (!position) {
      return {
        position: 'fixed',
        top: '0px',
        left: '0px',
        height: '0px',
        opacity: 0,
        zIndex: 1000,
      } as React.CSSProperties;
    }

    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      top: `${position.top}px`,
      left: `${position.left}px`,
      height: `${position.height}px`,
      width: `${position.width}px`,
      transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      zIndex: 1000,
    };

    return { ...baseStyle, boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.24)' };
  };

  if (!mounted || !position) return null;

  return (
    <div
      ref={drawerRef}
      className={cn(
        'border-border-dark top-0 rounded-[20px] border bg-white shadow-lg',
        getTransformValue(),
        className,
      )}
      style={getPositionStyle()}
    >
      <div className={cn('relative flex h-full flex-col overflow-hidden', contentClassName)}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};

export default SideDrawer;
