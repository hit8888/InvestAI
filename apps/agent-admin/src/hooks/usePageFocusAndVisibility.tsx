import { useEffect, useState } from 'react';

const usePageFocusAndVisibility = (onFocus?: () => void, onBlur?: () => void) => {
  const [isPageFocused, setIsPageFocused] = useState(true);

  useEffect(() => {
    const handleFocus = () => {
      setIsPageFocused(true);
      if (onFocus) onFocus();
    };

    const handleBlur = () => {
      setIsPageFocused(false);
      if (onBlur) onBlur();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      } else {
        handleBlur();
      }
    };

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onFocus, onBlur]);

  return isPageFocused;
};

export default usePageFocusAndVisibility;
