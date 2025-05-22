import { useState } from 'react';
import VideosSourcesIcon from '@breakout/design-system/components/icons/sources-videos-icon';
import VideoThumbnailPauseIcon from '@breakout/design-system/components/icons/video-thumbnail-pause-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { DataSourceItem } from '@meaku/core/types/admin/api';

type IProps = {
  item: DataSourceItem | File;
};

const SingleVideoUploadDisplayItem = ({ item }: IProps) => {
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    video.currentTime = 1; // Seek to 1 second to get a good thumbnail
    setVideoDuration(video.duration);
  };

  const dataSourceItem = item as DataSourceItem;
  const { type, name } = dataSourceItem;
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
      {'type' in item ? (
        <div className="relative h-12 w-20">
          <VideoThumbnailPauseIcon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
          <video
            src={URL.createObjectURL(item as File)}
            className="h-full w-full rounded object-fill"
            onLoadedMetadata={handleVideoLoadedMetadata}
          />
        </div>
      ) : (
        <VideosSourcesIcon width="16" height="16" className="text-gray-500" />
      )}
      <div className="flex flex-1 flex-col">
        <Typography variant="body-14" className="max-w-lg truncate text-system">
          {name}
        </Typography>
        <div className="flex items-center gap-2">
          <Typography variant="caption-12-normal" className="text-gray-500">
            {type.split('/')[1]}
          </Typography>
          <Typography variant="caption-12-normal" className="text-gray-500">
            • {Math.floor((item as File).size / (1024 * 1024))} MB
          </Typography>
        </div>
      </div>
      {videoDuration && (
        <Typography variant="caption-12-normal" className="pr-2 text-gray-500">
          {formatDuration(videoDuration)}
        </Typography>
      )}
    </div>
  );
};

export default SingleVideoUploadDisplayItem;
