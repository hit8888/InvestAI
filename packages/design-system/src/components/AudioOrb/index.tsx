import { OrbStatusEnum } from '@meaku/core/types/config';
import { cn } from '../../lib/cn';
import ShiningRectangle from '../icons/ShiningRectangle';
import './index.css';

interface IProps {
  color: string | null;
  state: OrbStatusEnum;
  width: number;
  height: number;
}

const AudioOrb = ({ color, width, height }: IProps) => {
  return (
    <div
      className={cn('audio-orb p-1', {})}
      style={
        {
          '--input-color': color ?? 'rgb(var(--primary))',
          '--fallback-color': color ?? 'rgb(var(--primary))',
          '--width': `${width}px`,
          '--height': `${height}px`,
        } as React.CSSProperties
      }
    >
      <ShiningRectangle width="25" height="13" />
    </div>
  );
};

export default AudioOrb;
