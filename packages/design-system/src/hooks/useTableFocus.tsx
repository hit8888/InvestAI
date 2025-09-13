import { useEffect, useCallback, RefObject } from 'react';

interface UseTableFocusProps {
  headerRef: RefObject<HTMLDivElement | null>;
  tableBodyRef: RefObject<HTMLDivElement | null>;
  isHeaderSticky: boolean;
  isEnabled?: boolean;
}

/**
 * Custom hook to manage table focus behavior
 * - Auto-focuses the header on mount
 * - Refocuses header when clicking outside the table
 * - Handles focus between sticky and normal header states
 */
export const useTableFocus = ({ headerRef, tableBodyRef, isHeaderSticky, isEnabled = true }: UseTableFocusProps) => {
  // Get the currently active header element (sticky or normal)
  const getActiveHeaderElement = useCallback(() => {
    if (isHeaderSticky && headerRef.current) {
      return headerRef.current;
    }
    return tableBodyRef.current;
  }, [isHeaderSticky, headerRef, tableBodyRef]);

  // Focus the active header element
  const focusHeader = useCallback(() => {
    if (!isEnabled) return;

    const activeElement = getActiveHeaderElement();
    if (activeElement) {
      // Use setTimeout to ensure the element is ready to receive focus
      setTimeout(() => {
        activeElement.focus({ preventScroll: true });
      }, 0);
    }
  }, [isEnabled, getActiveHeaderElement]);

  // Handle clicks outside the table to refocus header
  const handleDocumentClick = useCallback(
    (event: MouseEvent | Event) => {
      if (!isEnabled) return;

      const target = event.target as Element;
      const headerElement = headerRef.current;
      const bodyElement = tableBodyRef.current;

      // Check if the click was outside both header and body elements
      let isOutsideTable = true;

      if (headerElement && headerElement.contains(target)) {
        isOutsideTable = false;
      }
      if (bodyElement && bodyElement.contains(target)) {
        isOutsideTable = false;
      }

      // Also check if the target is a table element itself
      if (
        target.closest('table') &&
        (headerElement?.contains(target.closest('table')) || bodyElement?.contains(target.closest('table')))
      ) {
        isOutsideTable = false;
      }

      if (isOutsideTable) {
        // Small delay to ensure the click event is processed first
        setTimeout(() => {
          focusHeader();
        }, 10);
      }
    },
    [isEnabled, headerRef, tableBodyRef, focusHeader],
  );

  // Auto-focus header on mount
  useEffect(() => {
    if (!isEnabled) return;

    // Focus the header when component mounts
    focusHeader();
  }, [focusHeader, isEnabled]);

  // Handle sticky header state changes
  useEffect(() => {
    if (!isEnabled) return;

    // When sticky state changes, refocus the appropriate element
    const currentActiveElement = document.activeElement;
    const headerElement = headerRef.current;
    const bodyElement = tableBodyRef.current;

    // If either header or body was focused, refocus the new active element
    if (currentActiveElement === headerElement || currentActiveElement === bodyElement) {
      focusHeader();
    }
  }, [isHeaderSticky, focusHeader, isEnabled, headerRef, tableBodyRef]);

  // Set up document click listener
  useEffect(() => {
    if (!isEnabled) return;

    // Use both capture and bubble phases to catch all clicks
    document.addEventListener('mousedown', handleDocumentClick, true);
    document.addEventListener('click', handleDocumentClick, false);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick, true);
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, [handleDocumentClick, isEnabled]);

  // Make header elements focusable
  useEffect(() => {
    if (!isEnabled) return;

    const headerElement = headerRef.current;
    const bodyElement = tableBodyRef.current;

    // Ensure both elements are focusable
    if (headerElement && !headerElement.hasAttribute('tabindex')) {
      headerElement.setAttribute('tabindex', '0');
    }
    if (bodyElement && !bodyElement.hasAttribute('tabindex')) {
      bodyElement.setAttribute('tabindex', '0');
    }
  }, [headerRef, tableBodyRef, isEnabled]);

  return {
    focusHeader,
  };
};
