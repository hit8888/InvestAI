import useSound from '@meaku/core/hooks/useSound';
import popupsound from '../../../../assets/popup-chime.mp4';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';

type IProps = {
  size: number;
  delay: number;
  index: number;
  isExiting: boolean;
};

const PopupBubble = ({ size, delay, index, isExiting }: IProps) => {
  // Calculate volume multiplier based on bubble size and index
  // This creates a crescendo effect as larger bubbles appear
  const volumeMultiplier = (size / 40) * (index + 1) * 0.5; // Larger bubbles = louder sound
  const baseVolume = 0.35; // Lower base volume to allow for crescendo
  const { play } = useSound(popupsound, baseVolume);

  useEffect(() => {
    if (!isExiting) {
      // Stagger the sound playback
      const timer = setTimeout(() => {
        play(volumeMultiplier);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [delay, isExiting, play, volumeMultiplier]);
  return (
    <motion.div
      initial={{ scale: 0, y: 0, opacity: 0 }}
      animate={{
        scale: 1,
        y: index === 2 ? -index * 20 : index === 1 ? -30 + index * 20 : -20,
        x: index === 2 ? -20 - index * 20 : index === 1 ? -10 - index * 20 : -index * 20,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        y: 0,
        x: 0,
        opacity: 0,
        transition: {
          delay: (2 - index) * 0.3, // Reverse order exit
          duration: 0.5,
        },
      }}
      transition={{
        duration: 0.8,
        delay: isExiting ? 0 : delay,
      }}
      className={'absolute -left-4 bottom-0 -translate-x-1/2'}
    >
      <div>
        <Orb
          style={{
            width: size,
            height: size,
            zIndex: 10,
          }}
          color="rgb(var(--primary))"
          state={OrbStatusEnum.waiting}
        />
      </div>
    </motion.div>
  );
};

export default PopupBubble;
