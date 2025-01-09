import { memo, useEffect, useRef, useCallback } from 'react';

// Add new interfaces/types
interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
}

const AudioVisualizer = memo(
  ({ audioRef, height = 100, width = 600, barWidth = 2, barGap = 1, barColor = '#4F4A85' }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    console.log({ audioRefOutside: audioRef.current });

    const draw = useCallback(() => {
      if (!analyserRef.current || !canvasRef.current) return;
      console.log('draw k anadar');
      const analyzer = analyserRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const totalBars = Math.floor(width / (barWidth + barGap));
      const step = Math.floor(bufferLength / totalBars);
      console.log({ totalBars });
      console.log({ step });

      for (let i = 0; i < totalBars; i++) {
        const x = i * (barWidth + barGap);
        const value = dataArray[i * step];
        const barHeight = (value / 255) * height;

        ctx.fillStyle = barColor;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      }

      rafIdRef.current = requestAnimationFrame(draw);
    }, [barColor, barGap, barWidth, height, width]);

    useEffect(() => {
      console.log('audioRef.current', audioRef.current);

      if (!audioRef.current) return;

      console.log({ audioRefinside: audioRef.current });

      contextRef.current = new AudioContext();
      analyserRef.current = contextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      sourceRef.current = contextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(contextRef.current.destination);

      rafIdRef.current = requestAnimationFrame(draw);
      console.log('yahaaan bhi');

      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
        contextRef.current?.close();
      };
    }, [audioRef, draw]);

    return <canvas ref={canvasRef} width={width} height={height} />;
  },
);

export { AudioVisualizer };
