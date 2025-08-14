import React, { useEffect, useState } from 'react';

interface NudgeTimeoutLoaderProps {
  duration: number;
}

const NudgeTimeoutLoader: React.FC<NudgeTimeoutLoaderProps> = ({ duration }) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, duration - elapsedTime);
      const remainingPercentage = (remainingTime / duration) * 100;

      setWidth(remainingPercentage);

      if (remainingPercentage <= 0) {
        clearInterval(timer);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="absolute top-0 inset-x-0 h-1 rounded-full bg-gray-100">
      <div
        className="absolute top-0 left-0 h-full bg-primary w-full origin-left rounded-full"
        style={{ transform: `scaleX(${width / 100})` }}
      />
    </div>
  );
};

export default NudgeTimeoutLoader;
