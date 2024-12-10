import { cn } from '../../lib/cn';
import ShiningRectangle from '../icons/ShiningRectangle';
import './index.css';

export enum OrbStatusEnum {
  takingInput = 'takingInput',
  thinking = 'thinking',
  responding = 'responding',
  waiting = 'waiting',
}

interface IProps {
  color: string;
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
      })}
      style={{ '--input-color': color, '--fallback-color': '#acb2eb' } as React.CSSProperties}
    >
      <ShiningRectangle width="33" height="17" />
    </div>
  );
};

export default Orb;
