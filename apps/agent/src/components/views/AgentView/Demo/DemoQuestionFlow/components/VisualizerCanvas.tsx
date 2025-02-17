import { RefObject } from 'react';

interface VisualizerCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isRecording?: boolean;
  isLoading?: boolean;
}

export const VisualizerCanvas = ({ canvasRef, isRecording, isLoading }: VisualizerCanvasProps) => (
  <canvas
    ref={canvasRef}
    className={`h-[64px] w-[64px] transition-all duration-300 ${isLoading ? 'animate-pulse opacity-50' : ''}`}
    style={{
      background:
        'radial-gradient(61.46% 61.46% at 50% 38.54%, #f5f5ff 0%, var(--input-color, rgb(var(--primary))) 100%)',
      boxShadow: isRecording
        ? '0px 0px 16px 2px #fff, 0px 8px 12px 0px rgba(0, 0, 0, 0.16)'
        : '0px 0px 12px 1px #fff, 0px 4px 8px 0px rgba(0, 0, 0, 0.12)',
      backdropFilter: isRecording ? 'blur(12px)' : 'blur(7px)',
      borderRadius: '96px',
      animation: isRecording ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
    }}
  />
);
