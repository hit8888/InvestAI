import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '../../lib/cn';
import ShiningRectangle from '../icons/ShiningRectangle';
import './index.css';

interface IProps {
  color: string | null;
  state: OrbStatusEnum;
}

const Orb = ({ color, state }: IProps) => {
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
          '--input-color': 'rgb(var(--primary))',
          '--fallback-color': 'rgb(var(--primary))',
        } as React.CSSProperties
      }
    >
      <ShiningRectangle width="33" height="17" />
    </div>
  );
};

export default Orb;
