import { useEffect, useRef, useState, useCallback } from 'react';

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  onresult: (event: { results: SpeechRecognitionResult[] }) => void;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  commands?: Array<{
    command: string | RegExp;
    callback: (command: string) => void;
  }>;
}

const MAX_RETRIES = 3;

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const retryCountRef = useRef(0);

  // Add command matching
  const matchCommands = useCallback(
    (text: string) => {
      options.commands?.forEach(({ command, callback }) => {
        if (typeof command === 'string' && text.includes(command)) {
          callback(command);
        } else if (command instanceof RegExp && command.test(text)) {
          callback(text);
        }
      });
    },
    [options.commands],
  );

  const startListening = useCallback(async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = options.continuous ?? true;
      recognitionRef.current.interimResults = options.interimResults ?? true;
      recognitionRef.current.lang = options.language ?? 'en-US';

      // Enhanced error handling
      recognitionRef.current.onerror = (event) => {
        if (event.error === 'network' && retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(startListening, 1000);
        } else {
          setError(`Speech recognition error: ${event.error}`);
          setListening(false);
        }
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            matchCommands(transcript);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      // Add reconnection logic
      recognitionRef.current.onend = () => {
        if (listening && !error) {
          startListening();
        }
      };

      await recognitionRef.current.start();
      setListening(true);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setListening(false);
      throw error;
    }
  }, [listening, error, options, matchCommands]);

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const resetTranscript = () => setTranscript('');

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    listening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
};
