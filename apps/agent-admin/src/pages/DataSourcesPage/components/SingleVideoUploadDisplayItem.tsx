import VideosSourcesIcon from '@breakout/design-system/components/icons/sources-videos-icon';
import VideoThumbnailPauseIcon from '@breakout/design-system/components/icons/video-thumbnail-pause-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { DataSourceItem } from '@neuraltrade/core/types/admin/api';
import { useVideoDuration } from '../../../hooks/useVideoDuration';
import { getSingleSourceItemTypeAndName, getSingleSourceItemVideoUrl } from '../utils';
import useFileSize from '../../../hooks/useFileSize';
import CustomVideoPlayer from '@breakout/design-system/components/layout/CustomVideoPlayer';
import { formatDurationToMinuteSeconds } from '../../../utils/common';

type IProps = {
  item: DataSourceItem | File;
};

const SingleVideoUploadDisplayItem = ({ item }: IProps) => {
  const { videoRef, videoDuration, handleVideoLoadedMetadata } = useVideoDuration();
  const isFile = item instanceof File;
  const { type, name } = getSingleSourceItemTypeAndName(item);
  const isTypeVideo = type === 'VIDEO';
  const { getFileSize } = useFileSize(item, !isTypeVideo);
  const { size, unit } = getFileSize();
  const videoUrl = getSingleSourceItemVideoUrl(item);

  const durationFromMetadata = 'metadata' in item ? item.metadata?.duration : null;

  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
      {!isFile ? (
        <div className="relative h-12 w-20">
          {isTypeVideo && (
            <VideoThumbnailPauseIcon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
          )}
          {isTypeVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="h-full w-full rounded object-fill"
              onLoadedMetadata={handleVideoLoadedMetadata}
              preload="metadata"
            />
          ) : (
            <CustomVideoPlayer
              showControls={false}
              className="rounded object-fill"
              videoURL={videoUrl}
              allowPictureInPicture={false}
              allowDownload={false}
            />
          )}
        </div>
      ) : (
        <VideosSourcesIcon width="16" height="16" className="text-gray-500" />
      )}
      <div className="flex flex-1 flex-col">
        <Typography variant="body-14" className="max-w-md truncate text-system">
          {name}
        </Typography>
        <div className="flex items-start gap-2">
          {type?.split('/')?.[1]?.length > 0 && (
            <Typography variant="caption-12-normal" textColor="gray500">
              {type.split('/')[1]}
            </Typography>
          )}
          {size ? (
            <Typography variant="caption-12-normal" textColor="gray500">
              • {size} {unit}
            </Typography>
          ) : null}
          {!isTypeVideo ? (
            <Typography variant="caption-12-normal" textColor="gray500" className="text-start">
              {type.toLowerCase()}.com
            </Typography>
          ) : null}
        </div>
      </div>
      {(videoDuration || durationFromMetadata) && (
        <Typography variant="caption-12-normal" className="pr-2 text-gray-500">
          {formatDurationToMinuteSeconds(videoDuration || Number(durationFromMetadata))}
        </Typography>
      )}
    </div>
  );
};

export default SingleVideoUploadDisplayItem;
