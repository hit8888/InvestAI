import { useEffect, useRef, useState } from 'react';

interface UseResponseAudioPlayerProps {
  audioUrl: string | undefined;
  onReceiveResponse: () => void;
  onPlaybackComplete: () => void;
  setAnalyserNode: (node: AnalyserNode | null) => void;
  recordingRestartDelay?: number;
}

export const useResponseAudioPlayer = ({
  audioUrl,
  onReceiveResponse,
  onPlaybackComplete,
  setAnalyserNode,
  recordingRestartDelay = 500,
}: UseResponseAudioPlayerProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (audioUrl) {
      onReceiveResponse();

      const handleResponsePlayEnd = () => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setAnalyserNode(null);

        setTimeout(onPlaybackComplete, recordingRestartDelay);
      };

      try {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audioRef.current = audio;

        // Add duration handler
        const handleLoadedMetadata = () => {
          setDuration(audio.duration);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        const context = new AudioContext();
        audioContextRef.current = context;
        const analyzer = context.createAnalyser();
        analyzer.fftSize = 256;

        audio.src = audioUrl;
        audio.load();

        audio.oncanplaythrough = () => {
          if (audio && context) {
            if (audioSourceRef.current) {
              audioSourceRef.current.disconnect();
            }

            audioSourceRef.current = context.createMediaElementSource(audio);
            audioSourceRef.current.connect(analyzer);
            analyzer.connect(context.destination);
            setAnalyserNode(analyzer);
            playPromiseRef.current = audio.play();
          }
        };

        audio.addEventListener('ended', handleResponsePlayEnd);
        return () => {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('ended', handleResponsePlayEnd);
        };
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    }
  }, [audioUrl]);

  return {
    audioContextRef,
    audioRef,
    audioSourceRef,
    playPromiseRef,
    duration, // Add duration to return object
  };
};
