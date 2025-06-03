import Typography from '@breakout/design-system/components/Typography/index';
import { useVideoDuration } from '../../hooks/useVideoDuration';

interface VideoDurationHandlerProps {
  videoUrl: string;
  className?: string;
  showVideo?: boolean;
  typographyVariant?: 'body-14' | 'caption-12-normal';
  typographyClassName?: string;
  renderVideo?: (props: { videoRef: React.RefObject<HTMLVideoElement | null> }) => React.ReactNode;
  renderDuration?: (duration: string) => React.ReactNode;
}

const VideoDurationHandler = ({
  videoUrl,
  className = '',
  showVideo = true,
  typographyVariant = 'body-14',
  typographyClassName = '',
  renderVideo,
  renderDuration,
}: VideoDurationHandlerProps) => {
  const { videoRef, videoDuration, formatDuration, handleVideoLoadedMetadata } = useVideoDuration();

  const defaultVideo = (
    <video
      ref={videoRef}
      src={videoUrl.length > 0 ? videoUrl : undefined}
      className={`h-full w-full rounded object-fill ${className}`}
      onLoadedMetadata={handleVideoLoadedMetadata}
    />
  );

  const defaultDuration = (
    <Typography className={typographyClassName} align="center" variant={typographyVariant}>
      {formatDuration(videoDuration || 0)}
    </Typography>
  );

  return (
    <>
      {showVideo && (renderVideo ? renderVideo({ videoRef }) : defaultVideo)}
      {renderDuration ? renderDuration(formatDuration(videoDuration || 0)) : defaultDuration}
    </>
  );
};

export default VideoDurationHandler;
