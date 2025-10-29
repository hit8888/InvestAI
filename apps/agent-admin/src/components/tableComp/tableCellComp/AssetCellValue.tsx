import { DataSourceItem as DataSourceItemType } from '@meaku/core/types/admin/api';
import VideoThumbnailPauseIcon from '@breakout/design-system/components/icons/video-thumbnail-pause-icon';
import SlidesThumbnailIcon from '@breakout/design-system/components/icons/slides-thumbnail-icon';
import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';
import Typography from '@breakout/design-system/components/Typography/index';
import { useVideoDuration } from '../../../hooks/useVideoDuration';
import { useVideoUrlDuration } from '../../../hooks/useVideoUrlDuration';
import { useImageLoader } from '../../../hooks/useImageLoader';
import HiddenExternalVideoPlayer from '../../HiddenExternalVideoPlayer';
import { Link2 as Link, Video, LucideIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { formatDurationToMinuteSeconds } from '../../../utils/common';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

type IProps = {
  value?: DataSourceItemType;
};

// Reusable component for video thumbnail overlay
const VideoThumbnailOverlay = () => (
  <VideoThumbnailPauseIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
);

// Reusable component for asset info row with icon, label, and optional duration
interface AssetInfoRowProps {
  icon: LucideIcon;
  label: string;
  iconClassName?: string;
  duration?: number | null;
}

const AssetInfoRow = ({ icon: Icon, label, iconClassName, duration }: AssetInfoRowProps) => (
  <div className="flex h-full w-full items-center justify-between">
    <div className="flex w-full items-center gap-2">
      <Icon className={iconClassName} />
      <Typography variant="caption-12-normal">{label}</Typography>
    </div>
    {duration && (
      <Typography variant="caption-12-normal" textColor="gray500">
        {formatDurationToMinuteSeconds(duration)}
      </Typography>
    )}
  </div>
);

// Reusable wrapper for video-like assets with thumbnail and info
interface VideoAssetWrapperProps {
  keyProp: string;
  children: ReactNode;
  infoRow: ReactNode;
}

const VideoAssetWrapper = ({ keyProp, children, infoRow }: VideoAssetWrapperProps) => (
  <div key={keyProp} className="flex w-full flex-col gap-2">
    <div className="relative flex aspect-video w-full max-w-60 flex-col items-center justify-center rounded bg-gray-100 ring-2 ring-gray-100">
      <VideoThumbnailOverlay />
      {children}
    </div>
    {infoRow}
  </div>
);

// Component for VIDEO type asset
interface VideoAssetProps {
  keyProp: string;
  publicUrl: string;
  name: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement | HTMLIFrameElement, Event>) => void;
  duration: number | null;
}

const VideoAsset = ({ keyProp, publicUrl, name, videoRef, onLoadedMetadata, duration }: VideoAssetProps) => (
  <VideoAssetWrapper
    keyProp={keyProp}
    infoRow={<AssetInfoRow icon={Video} label="Video File" iconClassName="text-bluegray-1000" duration={duration} />}
  >
    <video
      ref={videoRef}
      onLoadedMetadata={onLoadedMetadata}
      preload="metadata"
      src={publicUrl}
      aria-label={name}
      className="max-h-full max-w-full rounded object-contain"
    />
  </VideoAssetWrapper>
);

// Component for EXTERNAL type asset
interface ExternalVideoAssetProps {
  keyProp: string;
  publicUrl: string;
  duration: number | null;
  onLoadedMetadata: (duration: number) => void;
}

const ExternalVideoAsset = ({ keyProp, publicUrl, duration, onLoadedMetadata }: ExternalVideoAssetProps) => (
  <VideoAssetWrapper
    keyProp={keyProp}
    infoRow={<AssetInfoRow icon={Link} label="URL Video" iconClassName="text-blue_sec-1000" duration={duration} />}
  >
    <CustomVideoPlayer
      showControls={false}
      onLoadedMetadata={onLoadedMetadata}
      className="rounded object-contain"
      videoURL={publicUrl}
      allowPictureInPicture={false}
      allowDownload={false}
    />
  </VideoAssetWrapper>
);

// Component for IMAGE type asset
interface ImageAssetProps {
  keyProp: string;
  publicUrl: string;
  name: string;
}

const ImageAsset = ({ keyProp, publicUrl, name }: ImageAssetProps) => {
  const { isLoading, hasError, imgProps } = useImageLoader();

  return (
    <div
      key={keyProp}
      className="relative flex aspect-video w-full max-w-60 items-center justify-center rounded bg-gray-100"
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 rounded">
          <Skeleton className="h-full w-full rounded" />
        </div>
      )}
      <div className="absolute left-1 top-1 z-10 flex items-center justify-center rounded bg-system/60 p-1">
        <SlidesThumbnailIcon width={'12'} height={'12'} />
      </div>
      {!hasError && (
        <img
          src={publicUrl}
          alt={name}
          className={`max-h-full max-w-full rounded object-contain transition-opacity duration-200 ${
            !isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          {...imgProps}
        />
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100">
          <SlidesThumbnailIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Component for thumbnail asset data
interface ThumbnailAssetProps {
  id: string;
  assetUrl: string;
  videoUrl: string;
  videoType: 'VIDEO' | 'EXTERNAL';
  metadataDuration?: number | null;
}

const ThumbnailAsset = ({ id, assetUrl, videoUrl, videoType, metadataDuration }: ThumbnailAssetProps) => {
  const { isLoading, hasError, imgProps } = useImageLoader();

  const { duration, setDuration } = useVideoUrlDuration({
    videoUrl,
    videoType,
    metadataDuration,
  });

  const handleExternalVideoDuration = (fetchedDuration: number) => {
    setDuration(fetchedDuration);
  };

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div
        key={id}
        className="relative flex aspect-video w-full max-w-60 items-center justify-center rounded bg-gray-100 ring-2 ring-gray-100"
      >
        {isLoading && !hasError && (
          <div className="absolute inset-0 rounded">
            <Skeleton className="h-full w-full rounded" />
          </div>
        )}
        {!hasError && (
          <>
            <VideoThumbnailOverlay />
            <img
              src={assetUrl}
              alt="Thumbnail"
              className={`max-h-full max-w-full rounded object-contain transition-opacity duration-200 ${
                !isLoading ? 'opacity-100' : 'opacity-0'
              }`}
              {...imgProps}
            />
          </>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100">
            <Video className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <AssetInfoRow
        icon={videoType === 'EXTERNAL' ? Link : Video}
        label={videoType === 'EXTERNAL' ? 'URL Video' : 'Video File'}
        iconClassName={videoType === 'EXTERNAL' ? 'text-blue_sec-1000' : 'text-bluegray-1000'}
        duration={duration}
      />
      {/* Hidden player for external videos to fetch duration */}
      {videoType === 'EXTERNAL' && !duration && (
        <HiddenExternalVideoPlayer videoUrl={videoUrl} onDurationReady={handleExternalVideoDuration} />
      )}
    </div>
  );
};

const AssetCellValue = ({ value }: IProps) => {
  const { videoRef, videoDuration, handleVideoLoadedMetadata } = useVideoDuration();
  const [externalVideoDuration, setExternalVideoDuration] = useState<number | null>(null);

  const handleExternalVideoLoadedMetadata = (duration: number) => {
    setExternalVideoDuration(duration);
  };

  // Thumbnail shown
  if (value && 'metadata' in value && value.metadata && 'asset_url' in value.metadata) {
    // Validate required fields for thumbnail
    if (!value.public_url || !value.type) {
      return <div>No video data</div>;
    }

    const videoType = value.type as 'VIDEO' | 'EXTERNAL';
    const metadataDuration = value.metadata?.duration ? Number(value.metadata.duration) : null;

    return (
      <ThumbnailAsset
        id={value.id}
        assetUrl={value.metadata.asset_url}
        videoUrl={value.public_url}
        videoType={videoType}
        metadataDuration={metadataDuration}
      />
    );
  }

  // Validate required fields
  if (!value || !value.public_url || !value.name || !value.type) {
    return <div>No asset data</div>;
  }

  const { name, type, key, public_url } = value;
  const durationFromMetadata = 'metadata' in value ? value.metadata?.duration : null;
  const effectiveDuration = videoDuration || (durationFromMetadata ? Number(durationFromMetadata) : null);
  const externalEffectiveDuration =
    externalVideoDuration || (durationFromMetadata ? Number(durationFromMetadata) : null);

  // Render based on asset type
  switch (type) {
    case 'VIDEO':
      return (
        <VideoAsset
          keyProp={key}
          publicUrl={public_url}
          name={name}
          videoRef={videoRef}
          onLoadedMetadata={handleVideoLoadedMetadata}
          duration={effectiveDuration}
        />
      );

    case 'IMAGE':
      return <ImageAsset keyProp={key} publicUrl={public_url} name={name} />;

    case 'EXTERNAL':
      return (
        <ExternalVideoAsset
          onLoadedMetadata={handleExternalVideoLoadedMetadata}
          keyProp={key}
          publicUrl={public_url}
          duration={externalEffectiveDuration}
        />
      );

    default:
      return <div>Unknown asset type</div>;
  }
};

export default AssetCellValue;
