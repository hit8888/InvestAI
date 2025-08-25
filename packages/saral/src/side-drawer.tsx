import React, { useEffect, useState } from 'react';
import { cn } from './utils';

export interface SideDrawerPosition {
  left?: number;
  right?: number;
  top?: number;
  height?: number;
}

export interface SideDrawerProps {
  isOpen: boolean;
  position: SideDrawerPosition;
  onClose?: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  animationDuration?: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  position,
  children,
  side = 'right',
  className,
  contentClassName,
  //   showCloseButton = true,
  animationDuration = 300,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const getTransformValue = () => {
    if (side === 'right') {
      return isOpen ? '-translate-x-[50%] opacity-100' : 'translate-x-0 opacity-0';
    }
    return isOpen ? '-translate-x-[50%] opacity-100' : 'translate-x-0 opacity-0';
  };

  const getPositionStyle = () => {
    const baseStyle: React.CSSProperties = {
      top: `${position.top}px`,
      height: `${position.height}px`,
      transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };

    if (side === 'right') {
      baseStyle.left = position.left ? `${position.left}px` : '0px';
    } else {
      baseStyle.right = position.right ? `${position.right}px` : '0px';
    }

    return { ...baseStyle, boxShadow: '0 0 24px 0 rgba(0, 0, 0, 0.24)', zIndex: -1 };
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'border-border-dark absolute rounded-[20px] border bg-white shadow-lg',
        getTransformValue(),
        className,
      )}
      style={getPositionStyle()}
    >
      <div className={cn('relative flex h-full flex-col', contentClassName)}>{children}</div>
    </div>
  );
};

export default SideDrawer;
