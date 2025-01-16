import { cn } from '@breakout/design-system/lib/cn';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { MouseEventHandler } from 'react';

interface IProps {
  playingStatus: DemoPlayingStatus;
  onPlayPause: MouseEventHandler<HTMLDivElement>;
}

const DemoControls = ({ playingStatus, onPlayPause }: IProps) => {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-2 right-2 top-0 z-10 flex cursor-pointer items-center justify-center bg-black/30',
        {
          'opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100':
            playingStatus === DemoPlayingStatus.PLAYING,
        },
      )}
      onClick={onPlayPause}
    >
      {playingStatus === DemoPlayingStatus.PLAYING ? (
        <PauseIcon className="fill-white text-white" size={60} />
      ) : (
        <PlayIcon className="fill-white text-white" size={60} />
      )}
    </div>
  );
};

export { DemoControls };
