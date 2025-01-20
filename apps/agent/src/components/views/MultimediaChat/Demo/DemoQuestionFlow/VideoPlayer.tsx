import { useState, useEffect, RefObject } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  url: string;
  onLoadComplete: () => void;
  videoRef: RefObject<ReactPlayer | null>;
  playing: boolean;
}

export const VideoPlayer: React.FC<Props> = ({ url, onLoadComplete, videoRef, playing }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      // Add small delay before showing video
      const timer = setTimeout(() => {
        setIsVideoLoaded(true);
        onLoadComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [onLoadComplete, videoRef]);

  return (
    <div className="relative flex h-full w-full">
      <AnimatePresence>
        {!isVideoLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-background/80 absolute inset-0 z-10 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="h-full w-full"
      >
        <ReactPlayer
          ref={videoRef}
          url={url}
          playing={playing}
          muted={true}
          width="100%"
          height="100%"
          config={{
            file: {
              attributes: {
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                },
              },
            },
          }}
        />
      </motion.div>
    </div>
  );
};
