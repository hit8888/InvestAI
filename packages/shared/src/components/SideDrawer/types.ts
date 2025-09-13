import { ReactNode, RefObject } from 'react';

export interface SideDrawerProps {
  isOpen: boolean;
  targetRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
  contentClassName?: string;
  offset?: number;
  maxWidth?: number;
  minWidth?: number;
  onCloseComplete?: () => void;
}

export interface SideDrawerPosition {
  top: number;
  left: number;
  height: number;
  width: number;
}
