import VideosSourcesIcon from '@breakout/design-system/components/icons/sources-videos-icon';
import VideoThumbnailPauseIcon from '@breakout/design-system/components/icons/video-thumbnail-pause-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { DataSourceItem } from '@meaku/core/types/admin/api';
import { useVideoDuration } from '../../../hooks/useVideoDuration';
import { useEffect, useState } from 'react';
import { getSingleSourceItemTypeAndName, getSingleSourceItemVideoUrl } from '../utils';

type IProps = {
  item: DataSourceItem | File;
};

const useFileSize = (item: DataSourceItem | File) => {
  const [fileSize, setFileSize] = useState<number>(0);
  const isFile = item instanceof File;

  const fetchFileSize = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeInMB = Math.floor(parseInt(contentLength) / (1024 * 1024));
        setFileSize(sizeInMB);
      }
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  };

  useEffect(() => {
    if (!isFile && (item as DataSourceItem).public_url) {
      fetchFileSize((item as DataSourceItem).public_url);
    }
  }, [item, isFile]);

  const getFileSize = () => {
    if (isFile) {
      return Math.floor(item.size / (1024 * 1024));
    }
    return fileSize;
  };

  return { getFileSize };
};

const SingleVideoUploadDisplayItem = ({ item }: IProps) => {
  const { videoRef, videoDuration, formatDuration, handleVideoLoadedMetadata } = useVideoDuration();
  const isFile = item instanceof File;
  const { getFileSize } = useFileSize(item);
  const { type, name } = getSingleSourceItemTypeAndName(item);
  const videoUrl = getSingleSourceItemVideoUrl(item);

  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
      {!isFile ? (
        <div className="relative h-12 w-20">
          <VideoThumbnailPauseIcon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full rounded object-fill"
            onLoadedMetadata={handleVideoLoadedMetadata}
            preload="metadata"
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
            • {getFileSize()} MB
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
