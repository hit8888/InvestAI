import { RefObject } from 'react';
import { TranscriptionResult } from '../types';
import { VisualizerCanvas } from './VisualizerCanvas';

interface RecordingPlayerProps {
  transcription: TranscriptionResult;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export const RecordingPlayer = ({ transcription, canvasRef }: RecordingPlayerProps) => (
  <div className="relative z-10 flex flex-col items-center">
    <VisualizerCanvas canvasRef={canvasRef} isRecording={true} />
    <div className="mx-auto mt-8 max-w-[75%] text-center">
      <span className="font-medium text-primary/70">{transcription.interimTranscript || 'Listening...'}</span>
    </div>
  </div>
);
