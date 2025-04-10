import { OrbStatusEnum } from '@meaku/core/types/index';
import InputWaitingOrb from './InputWaitingOrb';
import { CSSProperties } from 'react';

interface InputOrbProps {
  showOrb: boolean;
  orbLogoUrl?: string;
  style?: CSSProperties;
  showThreeStar?: boolean;
  state: OrbStatusEnum;
}

const InputOrb = ({ showOrb, orbLogoUrl, style, showThreeStar, state }: InputOrbProps) => {
  if (!showOrb) return null;

  return (
    <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
      <InputWaitingOrb state={state} style={style} orbLogoUrl={orbLogoUrl} showThreeStar={showThreeStar} />
    </div>
  );
};

export default InputOrb;
