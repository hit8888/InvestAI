import React, { createContext, useContext } from 'react';
import { INITIAL_SCREEN_PROPERTIES, ScreenSize, useScreenSize } from '../hooks/useScreenSize';

type DeviceManagerContext = ScreenSize;

const DeviceManagerContext = createContext<DeviceManagerContext>(INITIAL_SCREEN_PROPERTIES);

const DeviceManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const screenSize = useScreenSize();

  return <DeviceManagerContext.Provider value={screenSize}>{children}</DeviceManagerContext.Provider>;
};

export const useIsMobile = () => {
  const { isMobile } = useContext<DeviceManagerContext>(DeviceManagerContext);
  return isMobile;
};

export const useDevice = () => {
  const deviceContext = useContext<DeviceManagerContext>(DeviceManagerContext);
  return deviceContext;
};

export default DeviceManagerProvider;
