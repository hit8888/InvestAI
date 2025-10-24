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
  onEnded?: () => void;
  playing?: boolean;
  style?: React.CSSProperties | undefined;
};

const CustomVideoPlayer = ({
  videoURL,
  className,
  allowDownload = false,
  allowPictureInPicture = true,
  showControls = true,
  onLoadedMetadata,
  onEnded,
  playing = false,
  style,
}: IProps) => {
  const playerRef = useRef(null) as ReactPlayerRef;

  const handleReady = () => {
    const player = playerRef.current;
    const duration = player?.getDuration();
    onLoadedMetadata?.(Math.ceil(duration ?? 0));
  };

  const borderRadius = style?.borderRadius;

  return (
    <div
      className={cn('relative', className)}
      style={{
        position: 'relative',
        paddingTop: '56.25%',
        borderRadius: borderRadius || '0',
        overflow: 'hidden',
      }}
    >
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
        controls={showControls}
        width="100%"
        height="100%"
        playing={playing}
        onReady={handleReady}
        onEnded={onEnded}
        style={{ ...style, position: 'absolute', top: 0, left: 0, padding: '2px' }}
        config={{
          file: {
            attributes: {
              style: { borderRadius: borderRadius || '0', width: '100%', height: '100%' },
              controlsList: `${!allowDownload ? 'nodownload' : ''}`,
              disablePictureInPicture: !allowPictureInPicture,
            },
          },
        }}
      />
      {/* Apply border-radius to all nested elements */}
      {borderRadius && (
        <style>
          {`
            .${className?.split(' ').join('.')} > div,
            .${className?.split(' ').join('.')} > div > div,
            .${className?.split(' ').join('.')} iframe {
              border-radius: ${borderRadius} !important;
            }
          `}
        </style>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
