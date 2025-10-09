import { useRef } from 'react';
import { cn } from '../../lib/cn';
import ReactPlayer from 'react-player';

export type ReactPlayerRef = React.RefObject<ReactPlayer | null>;

type IProps = {
  videoURL: string;
  className?: string;
  allowDownload?: boolean;
  allowPictureInPicture?: boolean;
  showControls?: boolean;
  onLoadedMetadata?: (duration: number) => void;
};

const CustomVideoPlayer = ({
  videoURL,
  className,
  allowDownload = false,
  allowPictureInPicture = true,
  showControls = true,
  onLoadedMetadata,
}: IProps) => {
  const playerRef = useRef(null) as ReactPlayerRef;

  const handleReady = () => {
    const player = playerRef.current;
    const duration = player?.getDuration();
    onLoadedMetadata?.(Math.ceil(duration ?? 0));
  };

  return (
    <div className={cn('relative', className)} style={{ position: 'relative', paddingTop: '56.25%' }}>
      {!showControls && (
        <div
          className="absolute inset-0 z-50 h-full w-full cursor-default bg-transparent"
          style={{ pointerEvents: 'auto' }}
        />
      )}
      <ReactPlayer
        ref={playerRef}
        url={videoURL}
        preload="metadata"
        controls
        width="100%"
        height="100%"
        onReady={handleReady}
        style={{ position: 'absolute', top: 0, left: 0, padding: '2px' }}
        config={{
          file: {
            attributes: {
              controlsList: `${!allowDownload ? 'nodownload' : ''}`,
              disablePictureInPicture: !allowPictureInPicture,
            },
          },
        }}
      />
    </div>
  );
};

export default CustomVideoPlayer;
