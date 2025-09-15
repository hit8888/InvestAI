import { useEffect, useState } from 'react';
import { cn } from '@meaku/saral';
import { useModalPortal, useBehindContentPortal } from '../../hooks/usePortal';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { SideDrawerProps } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSideDrawerPosition } from './hooks/useSideDrawerPosition';
import { useSideDrawerAnimation } from './hooks/useSideDrawerAnimation';
import { SideDrawerContent } from './SideDrawerContent';

/**
 * SideDrawer component that slides in from either side of a target element.
 * Uses portals to render outside the normal DOM hierarchy while maintaining
 * proper stacking context and animations.
 *
 * @param {boolean} props.isOpen - Controls the visibility and animation state of the drawer.
 * @param {React.RefObject<HTMLElement | null>} props.targetRef - A ref to the element the drawer should position itself relative to.
 * @param {React.ReactNode} props.children - The content to be rendered inside the drawer.
 * @param {'left' | 'right'} [props.side='right'] - The side of the target element the drawer should appear on.
 * @param {string} [props.className] - Additional CSS classes for the drawer container.
 * @param {string} [props.contentClassName] - Additional CSS classes for the drawer's inner content.
 * @param {number} [props.offset=0] - Additional offset in pixels from the target element.
 * @param {number} [props.maxWidth=1000] - Maximum width of the drawer.
 * @param {number} [props.minWidth=400] - Minimum width of the drawer.
 * @param {() => void} [props.onCloseComplete] - Callback function called when the drawer's exit animation completes.
 *
 * @example
 * ```tsx
 * <SideDrawer
 *   isOpen={isOpen}
 *   targetRef={containerRef}
 *   side="left"
 *   onCloseComplete={() => console.log('Drawer closed')}
 * >
 *   <div>Drawer Content</div>
 * </SideDrawer>
 * ```
 */
export const SideDrawer = ({
  isOpen,
  targetRef,
  children,
  side = 'right',
  className,
  contentClassName,
  offset = 0,
  maxWidth = 1000,
  minWidth = 400,
  onCloseComplete,
}: SideDrawerProps) => {
  // State hooks
  const [mounted, setMounted] = useState(false);

  // Custom hooks
  const isMobile = useIsMobile();
  const modalPortal = useModalPortal();
  const behindContentPortal = useBehindContentPortal();

  // Use modal portal for mobile, behind content portal for web
  const { renderInPortal, getZIndex } = isMobile ? modalPortal : behindContentPortal;
  const { position, calculatePosition } = useSideDrawerPosition({
    targetRef,
    side,
    minWidth,
    maxWidth,
    offset,
    isOpen,
  });
  const animation = useSideDrawerAnimation(side, position, targetRef);

  // Mount/unmount effect
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle window resize
  useEffect(() => {
    if (targetRef?.current && isOpen) {
      calculatePosition();

      const handleResize = () => {
        requestAnimationFrame(calculatePosition);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [targetRef, calculatePosition, isOpen]);

  // Handle target element size changes
  useEffect(() => {
    if (isOpen && targetRef?.current) {
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(calculatePosition);
      });
      resizeObserver.observe(targetRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [isOpen, targetRef, calculatePosition]);

  if (!mounted || !position) return null;

  return renderInPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          {...animation}
          onAnimationComplete={() => {
            if (!isOpen) {
              // Call the onCloseComplete callback when exit animation finishes
              onCloseComplete?.();
            }
          }}
          className={cn(
            'border-border-dark fixed top-0 rounded-[20px] border bg-white shadow-lg overflow-hidden',
            className,
          )}
          style={{
            zIndex: getZIndex(),
            pointerEvents: 'auto',
            contain: 'paint layout',
            isolation: 'isolate',
          }}
        >
          <SideDrawerContent contentClassName={contentClassName} position={position}>
            {children}
          </SideDrawerContent>
        </motion.div>
      )}
    </AnimatePresence>,
  );
};
