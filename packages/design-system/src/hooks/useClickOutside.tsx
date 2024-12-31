import { useEffect, RefObject } from "react";

/**
 * Custom hook to handle clicks outside of a given element.
 *
 * @param ref - React ref object pointing to the element
 * @param onOutsideClick - Callback function to invoke when clicking outside the element
 */
const useClickOutside = (ref: RefObject<HTMLButtonElement | HTMLDivElement>, onOutsideClick: () => void) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    // Add event listener for outside click
    document.addEventListener("click", handleOutsideClick);

    // Cleanup event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [ref, onOutsideClick]);
};

export default useClickOutside;
