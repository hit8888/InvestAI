import { useEffect, useRef, useState } from 'react';
import { useSpeechRecognition } from '../../../../../hooks/useSpeechRecognition';

interface AudioRecorderProps {
  setAnalyserNode: React.Dispatch<React.SetStateAction<AnalyserNode | null>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setTranscription: React.Dispatch<React.SetStateAction<TranscriptionResult>>;
  isTranscribing: boolean;
  disabled: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

interface TranscriptionResult {
  transcript: string;
  isLoading: boolean;
  error?: string;
  interimTranscript?: string; // Add this to TranscriptionResult interface
}

const AudioRecorder = ({
  setAnalyserNode,
  setIsRecording,
  setTranscription,
  disabled,
  onStartRecording,
  onStopRecording,
}: AudioRecorderProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSentTranscriptRef = useRef(false);
  const lastSendTimeRef = useRef<number>(0);
  const [interimTranscript, setInterimTranscript] = useState(''); // Add state for interim transcription

  const {
    transcript,
    listening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    language: 'en-US',
  });

  const normalizeTranscript = (text: string) => text.trim().toLowerCase();

  const SPEECH_COMPLETION_DELAY = 2000; // 2s delay after speech ends

  // Modified error handling
  useEffect(() => {
    if (error) {
      if (error.includes('no-speech')) {
        // Pass the no-speech error up to parent with full error string
        setTranscription((prev) => ({
          ...prev,
          error: `Speech recognition error: ${error}`,
          transcript: '', // Clear any partial transcript
          isLoading: false,
        }));
      } else {
        // Handle other errors
        setTranscription((prev) => ({
          ...prev,
          error,
          isLoading: false,
        }));
        stopListening();
      }
    }
  }, [error]);

  // Modified transcript handling
  useEffect(() => {
    if (transcript && !disabled) {
      // Update interim transcript for UI feedback
      setInterimTranscript(transcript);

      // Clear any existing timeout
      if (transcriptionTimeoutRef.current) {
        clearTimeout(transcriptionTimeoutRef.current);
      }

      // Wait for speech completion
      transcriptionTimeoutRef.current = setTimeout(() => {
        const normalizedTranscript = normalizeTranscript(transcript);

        if (!hasSentTranscriptRef.current && normalizedTranscript) {
          hasSentTranscriptRef.current = true;
          // Only update actual transcription after delay
          setTranscription((prev) => ({
            ...prev,
            transcript: normalizedTranscript,
            isLoading: false,
          }));
          stopListening();
        }
      }, SPEECH_COMPLETION_DELAY);
    }

    return () => {
      if (transcriptionTimeoutRef.current) {
        clearTimeout(transcriptionTimeoutRef.current);
      }
    };
  }, [transcript, disabled]);

  // Reset state when starting recording
  const startRecording = async () => {
    try {
      hasSentTranscriptRef.current = false;
      lastSendTimeRef.current = 0;
      setTranscription((prev) => ({
        ...prev,
        transcript: '',
        error: undefined,
        isLoading: false,
      }));
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();

      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.5;

      source.connect(analyserNode);
      audioContextRef.current = audioContext;
      streamRef.current = stream;
      setAnalyserNode(analyserNode);

      resetTranscript();
      await startListening();
      setIsRecording(true);
      onStartRecording?.();
    } catch (error) {
      console.error('Error starting recording:', error);
      setTranscription((prev) => ({
        ...prev,
        error: 'Failed to start recording',
      }));
    }
  };

  const stopRecording = async () => {
    setInterimTranscript(''); // Clear interim transcript when stopping
    await stopListening();

    if (transcriptionTimeoutRef.current) {
      clearTimeout(transcriptionTimeoutRef.current);
      transcriptionTimeoutRef.current = null;
    }

    if (audioContextRef.current?.state !== 'closed') {
      try {
        audioContextRef.current?.close();
      } catch (e) {
        console.error('Error closing audioContext:', e);
      }
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setAnalyserNode(null);
    setIsRecording(false);
    onStopRecording?.();
  };

  // Handle disabled state immediately
  useEffect(() => {
    const handleDisabled = async () => {
      if (disabled) {
        if (listening) {
          await stopRecording();
        }
        if (transcriptionTimeoutRef.current) {
          clearTimeout(transcriptionTimeoutRef.current);
          transcriptionTimeoutRef.current = null;
        }
      } else if (!listening && !disabled) {
        await startRecording();
      }
    };

    handleDisabled();
  }, [disabled]);

  // Pass interim transcript to parent
  useEffect(() => {
    setTranscription((prev) => ({
      ...prev,
      interimTranscript,
      isLoading: false,
    }));
  }, [interimTranscript]);

  if (!browserSupportsSpeechRecognition || disabled) {
    return null;
  }

  return null;
};

export default AudioRecorder;
