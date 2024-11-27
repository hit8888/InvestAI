import Button from '@breakout/design-system/components/layout/button';
import { MinimizeIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';

interface IProps {
  isPlaying: boolean;
  handlePause?: () => void;
  handleRestart?: () => void;
}

const ArtifactControls = (props: IProps) => {
  const { isPlaying, handlePause, handleRestart } = props;

  const handleToggleMaximizeArtifact = useArtifactStore((state) => state.handleToggleMaximizeArtifact);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex h-14 translate-y-full transform items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-6 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
      <div>
        {!!handlePause && (
          <Button
            size="icon"
            className="h-8 w-8 border-2 border-gray-50 bg-transparent text-gray-50 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900"
            onClick={handlePause}
          >
            {isPlaying ? <PauseIcon className="h-4 w-4 fill-current" /> : <PlayIcon className="h-4 w-4 fill-current" />}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleToggleMaximizeArtifact}
          size="icon"
          className="h-8 w-8 border-2 border-gray-50 bg-transparent text-gray-50 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900"
        >
          <MinimizeIcon className="h-4 w-4 stroke-2" />
        </Button>
        {!!handleRestart && (
          <Button
            size="icon"
            className="h-8 w-8 border-2 border-gray-50 bg-transparent text-gray-50 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleRestart}
          >
            <RotateCcwIcon className="h-4 w-4 stroke-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArtifactControls;
