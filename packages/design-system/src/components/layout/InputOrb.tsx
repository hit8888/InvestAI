import { OrbStatusEnum } from '@neuraltrade/core/types/index';
import InputWaitingOrb from './InputWaitingOrb';
import { CSSProperties } from 'react';

interface InputOrbProps {
  showOrb?: boolean;
  orbLogoUrl?: string;
  style?: CSSProperties;
  showThreeStar?: boolean;
  state?: OrbStatusEnum;
  showOrbFromConfig: boolean;
}

const InputOrb = ({ showOrb, orbLogoUrl, style, showThreeStar, state, showOrbFromConfig }: InputOrbProps) => {
  if (!showOrb) return;
  return (
    <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2">
      <InputWaitingOrb
        state={state ?? OrbStatusEnum.waiting}
        style={style}
        showOrb={showOrbFromConfig}
        orbLogoUrl={orbLogoUrl}
        showThreeStar={showThreeStar}
      />
    </div>
  );
};

export default InputOrb;
