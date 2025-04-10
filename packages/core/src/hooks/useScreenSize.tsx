import { useEffect, useState, useCallback } from 'react';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

//Standard breakpoints for mobile, tablet and desktop
// Bootstrap 5:                    Material UI (MUI):      Tailwind CSS (default):
// Extra small (mobile): < 576px    Mobile: < 600px          sm (mobile): 640px
// Small (tablet): ≥ 576px          Tablet: 600px - 900px    md (tablet): 768px
// Medium: ≥ 768px                  Desktop: > 900px         lg: 1024px
// Large: ≥ 992px                                            xl: 1280px
// Extra large: ≥ 1200px                                     2xl: 1536px

const MOBILE_SCREEN_WIDTH_THRESHOLD = 576; // Taking the breakpoint from Bootstrap 5 as it matches with our usecase
const TABLET_SCREEN_WIDTH_THRESHOLD = 1024; // Taking the breakpoint from Tailwind CSS as it matches with our usecase

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const updateScreenSize = useCallback((width: number) => {
    setScreenWidth(width);
    if (width < MOBILE_SCREEN_WIDTH_THRESHOLD) {
      setScreenSize('mobile');
    } else if (width >= MOBILE_SCREEN_WIDTH_THRESHOLD && width < TABLET_SCREEN_WIDTH_THRESHOLD) {
      setScreenSize('tablet');
    } else {
      setScreenSize('desktop');
    }
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      // Debounce the resize handler
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        updateScreenSize(window.innerWidth);
      }, 100);
    };

    // Initial check
    updateScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateScreenSize]);

  return {
    screenSize,
    screenWidth,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
  };
};
