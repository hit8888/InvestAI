import React, { createContext, useContext } from 'react';
import { isMobileDevice } from '../utils';
import { useScreenSize } from '../hooks/useScreenSize';

const DeviceManagerContext = createContext<{ isMobile: boolean }>({ isMobile: false });

const DeviceManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobileDeviceDetected = isMobileDevice();
  const { isMobile: isMobileFromScreenSize, isTablet: isTabletFromScreenSize } = useScreenSize();

  // Combine device detection and screen size detection
  // isMobile will be true if either:
  // 1. The device is actually a mobile device, OR
  // 2. The screen size indicates mobile or tablet view
  const isMobile = isMobileDeviceDetected || isMobileFromScreenSize || isTabletFromScreenSize;

  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile]);

  return <DeviceManagerContext.Provider value={contextValue}>{children}</DeviceManagerContext.Provider>;
};

export const useIsMobile = () => {
  const { isMobile } = useContext(DeviceManagerContext);
  return isMobile;
};

export default DeviceManagerProvider;
