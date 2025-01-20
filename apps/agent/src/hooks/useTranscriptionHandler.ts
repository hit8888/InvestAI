import { useEffect } from 'react';
import { TranscriptionResult } from '../components/views/MultimediaChat/Demo/DemoQuestionFlow/types';

interface UseTranscriptionHandlerProps {
  transcription: TranscriptionResult;
  messageSentRef: React.MutableRefObject<boolean>;
  onSendMessage: (message: string) => void;
  onStopRecording: () => void;
  onNoSpeechDetected: () => void;
  setTranscription: React.Dispatch<React.SetStateAction<TranscriptionResult>>;
}

export const useTranscriptionHandler = ({
  transcription,
  messageSentRef,
  onSendMessage,
  onStopRecording,
  onNoSpeechDetected,
  setTranscription,
}: UseTranscriptionHandlerProps) => {
  useEffect(() => {
    if (transcription.transcript && !transcription.isLoading && !messageSentRef.current) {
      messageSentRef.current = true;
      onStopRecording();
      onSendMessage(transcription.transcript);
      setTranscription((prev) => ({ ...prev, transcript: '' }));
    } else if (transcription.error?.includes('no-speech')) {
      onNoSpeechDetected();
    }
  }, [transcription, onSendMessage]);
};
