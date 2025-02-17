export interface TranscriptionResult {
  transcript: string;
  interimTranscript?: string;
  isLoading: boolean;
  error?: string;
}

export interface AudioRecorderProps {
  setAnalyserNode: React.Dispatch<React.SetStateAction<AnalyserNode | null>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setTranscription: React.Dispatch<React.SetStateAction<TranscriptionResult>>;
  isTranscribing: boolean;
  disabled: boolean;
}
