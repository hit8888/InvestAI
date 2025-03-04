import { RefObject } from 'react';
import { TranscriptionResult } from '../types';
import { VisualizerCanvas } from './VisualizerCanvas';

interface RecordingPlayerProps {
  transcription: TranscriptionResult;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export const RecordingPlayer = ({ transcription, canvasRef }: RecordingPlayerProps) => (
  <div className="flex w-full items-center gap-4 px-4">
    <VisualizerCanvas canvasRef={canvasRef} isRecording={true} />
    <div className="max-w-[70%] flex-1">
      <span className="line-clamp-2 text-left text-primary/70">
        {transcription.interimTranscript || 'This is a voice-enabled interactive demo—just speak your questions.'}
      </span>
    </div>
  </div>
);
