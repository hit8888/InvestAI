import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { RGB_PRIMARY_COLOR } from '@meaku/core/utils/index';

interface InputWaitingOrbProps {
  orbLogoUrl?: string;
}

const InputWaitingOrb = ({ orbLogoUrl }: InputWaitingOrbProps) => {
  return <Orb color={RGB_PRIMARY_COLOR} state={OrbStatusEnum.waiting} orbLogoUrl={orbLogoUrl} />;
};

export default InputWaitingOrb;
