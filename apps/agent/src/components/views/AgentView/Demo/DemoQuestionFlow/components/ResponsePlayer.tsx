import { RefObject, useState, useEffect } from 'react';
import { VisualizerCanvas } from './VisualizerCanvas';
import { useTypeWords } from '@breakout/design-system/hooks/useTypeWords';

interface ResponsePlayerProps {
  message: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isLoading?: boolean;
  audioDuration?: number; // in seconds
  isPlaying?: boolean; // Add this prop
  orientation?: 'row' | 'column';
}

export const ResponsePlayer = ({
  message,
  canvasRef,
  isLoading,
  audioDuration = 0,
  isPlaying = true,
  orientation = 'column',
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
    <div className={`flex w-full items-center ${orientation === 'row' ? 'gap-6 px-4' : 'flex-col gap-6'}`}>
      <VisualizerCanvas canvasRef={canvasRef} isLoading={isLoading} />
      <div className={`${orientation === 'row' ? 'max-w-[70%] flex-1' : 'w-[50%]'} text-left`}>
        <span className={`line-clamp-none ${isLoading ? 'text-primary/50' : 'text-primary/70'}`}>
          {isLoading ? message : displayedMessage}
        </span>
      </div>
    </div>
  );
};
