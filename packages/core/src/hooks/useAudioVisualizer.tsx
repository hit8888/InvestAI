import { useRef, useEffect } from 'react';

interface IProps {
  analyserNode: AnalyserNode | null;
  audioUrl: string;
}

export const useAudioVisualizer = ({ analyserNode, audioUrl }: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const prevDataRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const smoothingFactor = 0.2;

    // Move constants outside draw loop since they don't change
    const targetWidth = canvas.width * 0.8;
    const barWidth = Math.max(2, Math.floor(canvas.width / 50));
    const barGap = barWidth / 2;
    const numBars = Math.floor(targetWidth / (barWidth + barGap));
    const totalWidth = Math.floor(numBars * barWidth + (numBars - 1) * barGap);
    const startX = Math.floor((canvas.width - totalWidth) / 2);
    const frequencyStep = Math.floor(bufferLength / numBars);
    const centerY = canvas.height / 2;
    const maxBarHeight = canvas.width / 2;

    // Pre-calculate bar positions
    const barPositions = new Array(numBars).fill(0).map((_, i) => Math.floor(startX + i * (barWidth + barGap)));

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numBars; i++) {
        // Calculate frequency data only for visible range
        const dataStart = i * frequencyStep;
        const dataEnd = dataStart + frequencyStep;
        let sum = 0;

        for (let j = dataStart; j < dataEnd; j++) {
          sum += dataArray[j];
        }
        let value = sum / frequencyStep;

        if (prevDataRef.current) {
          const prevValue = prevDataRef.current[dataStart];
          value = prevValue + (value - prevValue) * smoothingFactor;
        }

        // Optimize sin calculation
        const naturalMovement = Math.sin((Date.now() * 0.002 + i * 0.2) % (Math.PI * 2)) * 2;
        const barHeight = Math.min((value / 255) * maxBarHeight + naturalMovement, maxBarHeight);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(barPositions[i], centerY - barHeight / 2, barWidth, barHeight);
      }

      prevDataRef.current = new Uint8Array(dataArray);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyserNode, audioUrl]);

  return canvasRef;
};
