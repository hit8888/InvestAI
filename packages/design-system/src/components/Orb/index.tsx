import React, { CSSProperties } from 'react';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '../../lib/cn';
import ShiningRectangle from '../icons/ShiningRectangle';
import './index.css';
import ThreeStarInsideOrbIcon from '../icons/three-star-inside-orb-icon';

interface IProps {
  color: string | null;
  state: OrbStatusEnum;
  showThreeStar?: boolean;
  showOrb?: boolean;
  style?: CSSProperties;
  orbLogoUrl?: string | null | undefined;
}

const Orb = ({ color, state, style = {}, orbLogoUrl, showThreeStar = false, showOrb = true }: IProps) => {
  if (!showOrb && orbLogoUrl) {
    return <img src={orbLogoUrl} alt="orb logo" className="h-8 w-8 rounded-full object-contain" />;
  }

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
          ...style,
        } as React.CSSProperties
      }
    >
      {showThreeStar && (
        <div className="inset-0 flex flex-col items-center  justify-center">
          <ShiningRectangle width="25" height="13" />
          <ThreeStarInsideOrbIcon className="relative -top-1" height={'26'} width={'29'} />
        </div>
      )}
    </div>
  );
};

export default Orb;
