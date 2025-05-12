import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { RGB_PRIMARY_COLOR } from '@meaku/core/utils/index';
import { CSSProperties } from 'react';

interface InputWaitingOrbProps {
  orbLogoUrl?: string;
  style?: CSSProperties;
  showThreeStar?: boolean;
  showOrb?: boolean;
  state: OrbStatusEnum;
}

const InputWaitingOrb = ({ orbLogoUrl, style, showThreeStar, showOrb, state }: InputWaitingOrbProps) => {
  return (
    <Orb
      showOrb={showOrb}
      color={RGB_PRIMARY_COLOR}
      style={style}
      state={state}
      orbLogoUrl={orbLogoUrl}
      showThreeStar={showThreeStar}
    />
  );
};

export default InputWaitingOrb;
