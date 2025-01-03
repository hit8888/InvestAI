import React from 'react';
import './index.css';

interface IProps {
  color: string | null;
  height: number;
  width: number;
  waveSize: number;
}

const AudioOrb = ({ color, height, waveSize, width }: IProps) => {
  return (
    <div
      className="audio-container"
      style={
        {
          '--input-color': color ?? 'rgb(var(--primary))',
          '--fallback-color': color ?? 'rgb(var(--primary))',
          '--height': `${height}px`,
          '--width': `${width}px`,
          '--waveSize': `${waveSize}px`,
        } as React.CSSProperties
      }
    >
      <div className="audio-loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default AudioOrb;
