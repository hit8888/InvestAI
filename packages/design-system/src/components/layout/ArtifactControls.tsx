import { cn } from '@breakout/design-system/lib/cn';
import Button from '@breakout/design-system/components/Button/index';
import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';

interface IProps {
  isPlaying: boolean;
  isMediaTakingFullWidth: boolean;
  handlePause?: () => void;
  handleRestart?: () => void;
  handleToggleFullScreen?: () => void;
}

const ArtifactControls = ({
  isPlaying,
  handlePause,
  handleRestart,
  handleToggleFullScreen,
  isMediaTakingFullWidth,
}: IProps) => {
  return (
    <div
      className={cn(
        `absolute bottom-0 left-0 right-0 z-50 flex h-14 
      transform items-center justify-between 
     bg-gradient-to-t from-black/50 to-transparent p-6 pb-2
    text-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100`,
        {
          'translate-y-0 full-hd:-translate-y-[172px]': isMediaTakingFullWidth,
          'translate-y-full group-hover:translate-y-0': !isMediaTakingFullWidth,
        },
      )}
    >
      <div>
        {!!handlePause && (
          <Button buttonStyle="icon" variant="system_secondary" onClick={handlePause}>
            {isPlaying ? <PauseIcon className="h-4 w-4 fill-current" /> : <PlayIcon className="h-4 w-4 fill-current" />}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleToggleFullScreen} variant="system_secondary" buttonStyle="icon">
          {isMediaTakingFullWidth ? (
            <MinimizeIcon className="h-4 w-4 stroke-2" />
          ) : (
            <MaximizeIcon className="h-4 w-4 stroke-2" />
          )}
        </Button>
        {!!handleRestart && (
          <Button buttonStyle="icon" variant="system_secondary" onClick={handleRestart}>
            <RotateCcwIcon className="h-4 w-4 stroke-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArtifactControls;
