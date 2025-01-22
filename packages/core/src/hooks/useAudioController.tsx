import { useRef, useState, useEffect } from "react";

export const useAudioController = (
  audioUrl: string | undefined,
  onEnd: () => void,
  shouldInitialize: boolean
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const initializeAudioContext = async () => {
    try {
      if (!audioRef.current) throw new Error("Audio element not initialized");

      const context = new AudioContext();
      const source = context.createMediaElementSource(audioRef.current);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048; // Increased for better resolution
      analyser.smoothingTimeConstant = 0.8; // Smoother transitions
      source.connect(analyser);
      analyser.connect(context.destination);

      setAudioContext(context);
      setAnalyserNode(analyser);

      audioRef.current.load();
      audioRef.current.currentTime = 0;
      playPromiseRef.current = audioRef.current.play();
      await playPromiseRef.current;

      return analyser;
    } catch (error) {
      console.error("Error initializing audio context:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!audioUrl || !shouldInitialize) return;

    const newAudio = new Audio();
    newAudio.crossOrigin = "anonymous";
    newAudio.src = audioUrl;
    audioRef.current = newAudio;

    const handleLoadedMetadata = () => {
      setDuration(newAudio.duration);
    };

    newAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    newAudio.addEventListener("ended", onEnd);

    initializeAudioContext().catch(() => {
      // Error handling is done in the function
    });

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => newAudio.pause())
          .catch(() => {
            /* Ignore cleanup errors */
          });
      }
      newAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      newAudio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [audioUrl, shouldInitialize]);

  return {
    audioRef,
    playPromiseRef,
    analyserNode,
    audioContext,
    duration,
  };
};
