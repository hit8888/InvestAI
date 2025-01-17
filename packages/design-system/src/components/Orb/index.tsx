import React, { CSSProperties } from 'react';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '../../lib/cn';
import ShiningRectangle from '../icons/ShiningRectangle';
import './index.css';

interface IProps {
  color: string | null;
  state: OrbStatusEnum;
  style?: CSSProperties;
}

const Orb = ({ color, state, style={} }: IProps) => {
  return (
    <div
      className={cn('orb-container p-1', {
        'animate-taking-input': state === OrbStatusEnum.takingInput,
        'animate-thinking': state === OrbStatusEnum.thinking,
        'animate-waiting': state === OrbStatusEnum.waiting,
        'animate-responding': state === OrbStatusEnum.responding,
        'initial-background': state === OrbStatusEnum.idle,
      })}
      style={
        {
          '--input-color': color ?? 'rgb(var(--primary))',
          '--fallback-color': color ?? 'rgb(var(--primary))',
          ...style
        } as React.CSSProperties
      }
    >
      <ShiningRectangle width="25" height="13" />
    </div>
  );
};

export default Orb;
