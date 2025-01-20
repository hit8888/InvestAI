import { RefObject, useState, useEffect } from 'react';
import { VisualizerCanvas } from './VisualizerCanvas';
import { useTypeWords } from '@breakout/design-system/hooks/useTypeWords';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsePlayerProps {
  message: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isLoading?: boolean;
  audioDuration?: number; // in seconds
  isPlaying?: boolean; // Add this prop
}

export const ResponsePlayer = ({
  message,
  canvasRef,
  isLoading,
  audioDuration = 0,
  isPlaying = true,
}: ResponsePlayerProps) => {
  const wordCount = message.split(' ').length;

  // Adjusted timing calculation to slow down text
  const typingSpeed = Math.max(
    audioDuration > 0
      ? (audioDuration * 1000) / (wordCount * 1) // Reduced factor to slow down text
      : 250,
    100, // Increased minimum delay
  );

  const [shouldStartTyping, setShouldStartTyping] = useState(false);

  // Add initial delay to ensure audio starts first
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShouldStartTyping(true);
      }, 500); // 500ms initial delay
      return () => clearTimeout(timer);
    } else {
      setShouldStartTyping(false);
    }
  }, [isPlaying]);

  const displayedMessage = useTypeWords(message, typingSpeed, shouldStartTyping);

  return (
    <div className="relative z-10 flex flex-col items-center">
      <VisualizerCanvas canvasRef={canvasRef} isLoading={isLoading} />
      <div className="mx-auto mt-8 w-[75%] overflow-hidden">
        <div className="typewriter-container relative">
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isPlaying ? 1 : 0.9 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1], // Custom easing for smoother animation
              }}
              className={`
                block
                font-medium 
                leading-relaxed 
                tracking-normal
                text-primary/70
              `}
              style={{
                minHeight: '2em',
                wordSpacing: '0.025em', // Reduced word spacing
                whiteSpace: 'pre-wrap',
                fontKerning: 'normal',
                textRendering: 'optimizeLegibility',
                letterSpacing: '-0.01em', // Slightly tighter letter spacing
              }}
            >
              {isLoading ? message : displayedMessage}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
