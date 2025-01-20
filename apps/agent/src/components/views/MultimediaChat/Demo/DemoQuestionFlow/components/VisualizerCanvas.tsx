import { RefObject } from 'react';

interface VisualizerCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isRecording?: boolean;
  isLoading?: boolean;
}

export const VisualizerCanvas = ({ canvasRef, isRecording, isLoading }: VisualizerCanvasProps) => (
  <canvas
    ref={canvasRef}
    className={`h-[72px] w-[72px] rounded-full transition-all duration-300 ${isLoading ? 'animate-pulse opacity-50' : ''}`}
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
);
