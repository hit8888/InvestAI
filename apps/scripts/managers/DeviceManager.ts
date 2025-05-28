export function DeviceManager() {
  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      navigator.userAgent,
    );
  };

  const getDeviceType = (): "DESKTOP" | "TABLET" => {
    const width = window.innerWidth;
    return width >= 1024 ? "DESKTOP" : "TABLET";
  };

  // Return public API
  return {
    isMobile,
    getDeviceType,
  };
}
