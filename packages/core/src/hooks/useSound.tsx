import { useCallback, useMemo } from 'react';

const useSound = (soundPath: string, baseVolume = 0.2) => {
  // Clamp volume between 0 and 1
  const safeVolume = useMemo(() => Math.min(Math.max(baseVolume, 0), 1), [baseVolume]);

  const play = useCallback((volumeMultiplier = 1) => {
    const audio = new Audio(soundPath); // Use the passed soundPath instead of hardcoded value
    // Apply volume multiplier while respecting max volume of 1
    audio.volume = Math.min(safeVolume * volumeMultiplier, 1);

    audio.play().catch((error) => {
      console.warn('Sound playback failed:', error);
    });
  }, [soundPath, safeVolume]);

  return { play };
};

export default useSound;