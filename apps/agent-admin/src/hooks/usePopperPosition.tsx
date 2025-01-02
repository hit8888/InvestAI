import { useState, useEffect, RefObject } from 'react';

/**
 * Custom hook to determine the position of a popper based on available space.
 * @param isOpen - Boolean indicating whether the popper is open.
 * @param popperTriggerRef - Ref to the button triggering the popper.
 * @param popperOptionMenuRef - Ref to the popper menu.
 * @returns The position of the popper: either "top" or "bottom".
 */
const usePopperPosition = (
  isOpen: boolean,
  popperTriggerRef: RefObject<HTMLElement | null>,
  popperOptionMenuRef: RefObject<HTMLElement | null>,
): 'top' | 'bottom' => {
  // State to store the position of the popper menu
  const [popperMenuPosition, setPopperMenuPosition] = useState<'top' | 'bottom'>('bottom');

  useEffect(() => {
    // Only calculate the position if the popper is open
    if (isOpen) {
      // Get the dimensions and position of the button triggering the popper
      const popperButtonRect = popperTriggerRef.current?.getBoundingClientRect();

      // Get the height of the popper menu
      const popperMenuHeight = popperOptionMenuRef.current?.offsetHeight || 0;

      if (popperButtonRect) {
        // Calculate the available space above and below the button
        const spaceBelow = window.innerHeight - popperButtonRect.bottom;
        const spaceAbove = popperButtonRect.top;

        // Decide the position based on available space
        if (spaceBelow < popperMenuHeight && spaceAbove > popperMenuHeight) {
          setPopperMenuPosition('top');
        } else {
          setPopperMenuPosition('bottom');
        }
      }
    }
  }, [isOpen]);

  return popperMenuPosition;
};

export default usePopperPosition;
