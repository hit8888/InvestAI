import { useCallback, useMemo } from 'react';

export type UseSoundProps = {
  soundPath: string;
  baseVolume?: number;
  enabled?: boolean;
};

const useSound = (
  soundPath: UseSoundProps['soundPath'],
  baseVolume: UseSoundProps['baseVolume'] = 0.2,
  enabled: UseSoundProps['enabled'] = true,
) => {
  // Clamp volume between 0 and 1
  const safeVolume = useMemo(() => Math.min(Math.max(baseVolume, 0), 1), [baseVolume]);

  const play = useCallback(
    (volumeMultiplier = 1) => {
      if (!enabled) {
        return;
      }

      const audio = new Audio(soundPath);
      // Apply volume multiplier while respecting max volume of 1
      audio.volume = Math.min(safeVolume * volumeMultiplier, 1);

      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('Sound playback failed:', error);
          });
        }
      } catch (error) {
        console.warn('Sound playback failed:', error);
      }
    },
    [soundPath, safeVolume, enabled],
  );

  return { play };
};

export default useSound;
