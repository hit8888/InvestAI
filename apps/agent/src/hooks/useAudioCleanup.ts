import { useEffect, RefObject } from 'react';

interface AudioCleanupProps {
  playPromiseRef: RefObject<Promise<void> | null>;
  audioRef: RefObject<HTMLAudioElement | null>;
  audioContextRef: RefObject<AudioContext | null>;
  audioSourceRef: RefObject<MediaElementAudioSourceNode | null>;
  silenceTimeoutRef: RefObject<NodeJS.Timeout | null>;
  stopRecording: () => void;
  messageSentRef: RefObject<boolean>;
  silenceDetectionActiveRef: RefObject<boolean>;
}

export const useAudioCleanup = ({
  playPromiseRef,
  audioRef,
  audioContextRef,
  audioSourceRef,
  silenceTimeoutRef,
  stopRecording,
  messageSentRef,
  silenceDetectionActiveRef,
}: AudioCleanupProps) => {
  useEffect(() => {
    return () => {
      // Audio playback cleanup
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.remove();
          }
        });
      }

      // Audio context cleanup
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Audio source cleanup
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect();
      }

      // Recording state cleanup
      stopRecording();
      if (messageSentRef.current) messageSentRef.current = false;
      if (silenceDetectionActiveRef.current) silenceDetectionActiveRef.current = false;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);
};
