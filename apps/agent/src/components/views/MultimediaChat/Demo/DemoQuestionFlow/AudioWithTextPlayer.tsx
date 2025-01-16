import { RefObject, useEffect } from 'react';
import { TranscriptionResult } from './types';

interface AudioWithTextPlayerProps {
  message: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onPlayEnd?: () => void;
  isRecording?: boolean;
  isLoading?: boolean;
  transcription?: TranscriptionResult; // Add this prop
}

export const AudioWithTextPlayer = ({
  message,
  canvasRef,
  onPlayEnd,
  isRecording,
  isLoading,
  transcription, // Add this to destructuring
}: AudioWithTextPlayerProps) => {
  // Add audio element and control it
  useEffect(() => {
    const audio = document.querySelector('audio');

    // If there's a message and we're not recording or loading, play the audio
    if (message && !isRecording && !isLoading) {
      if (audio) {
        audio.play().catch(console.error);
      }
    }

    if (audio) {
      audio.addEventListener('ended', onPlayEnd || (() => {}));
      return () => {
        audio.pause();
        audio.removeEventListener('ended', onPlayEnd || (() => {}));
      };
    }
  }, [message, isRecording, isLoading, onPlayEnd]);

  const displayText = () => {
    if (isLoading) return 'Processing your question...';
    if (message) return message;
    if (isRecording && transcription?.interimTranscript) return transcription.interimTranscript;
    if (isRecording) return 'Listening...';
    return '';
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Change fixed to absolute to prevent dialog blocking */}
      <div className="absolute inset-0 bg-primary-foreground" />

      {/* Add relative positioning and z-index to content */}
      <div className="relative z-10 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className={`h-[72px] w-[72px] rounded-full transition-all duration-300 ${
            isLoading ? 'animate-pulse opacity-50' : ''
          }`}
          style={{
            background: isRecording
              ? 'radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.2), rgb(var(--primary)/ 0.5) 50%, rgba(0, 0, 0, 0.8) 100%)'
              : 'radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.2), rgb(var(--primary)/ 0.8) 50%, rgba(0, 0, 0, 1) 100%)',
            boxShadow: isLoading
              ? 'inset -4px -4px 8px rgba(0, 0, 0, 0.1), inset 4px 4px 8px rgba(255, 255, 255, 0.1)'
              : 'inset -4px -4px 8px rgba(0, 0, 0, 0.2), inset 4px 4px 8px rgba(255, 255, 255, 0.2)',
            transform: 'perspective(500px) rotateX(10deg)',
          }}
        />
        <div className="mx-auto mt-8 max-w-[75%] text-center">
          <span className={`font-medium text-primary/70 ${isLoading ? 'animate-pulse' : ''}`}>{displayText()}</span>
        </div>
      </div>
    </div>
  );
};
