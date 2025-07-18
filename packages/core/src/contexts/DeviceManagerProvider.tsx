import React, { createContext, useContext } from 'react';
import { isMobileDevice } from '../utils';
import { useScreenSize } from '../hooks/useScreenSize';

const DeviceManagerContext = createContext<{ isMobile: boolean }>({ isMobile: false });

const DeviceManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobileDeviceDetected = isMobileDevice();
  const { isMobile: isMobileFromScreenSize, isTablet: isTabletFromScreenSize } = useScreenSize();
  const isInsideIframe = window.self !== window.top;

  // Combine device detection and screen size detection
  // isMobile will be true if either:
  // 1. The device is actually a mobile device, OR
  // 2. The screen size indicates mobile or tablet view
  // 3. The app is inside an iframe
  const isMobile =
    isMobileDeviceDetected && isInsideIframe
      ? true
      : isMobileDeviceDetected || isMobileFromScreenSize || isTabletFromScreenSize;

  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile]);

  return <DeviceManagerContext.Provider value={contextValue}>{children}</DeviceManagerContext.Provider>;
};

export const useIsMobile = () => {
  const { isMobile } = useContext(DeviceManagerContext);
  return isMobile;
};

export default DeviceManagerProvider;
