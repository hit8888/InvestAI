import { DataSourceItem as DataSourceItemType, ThumbnailAssetData } from '@meaku/core/types/admin/api';
import VideoThumbnailPauseIcon from '@breakout/design-system/components/icons/video-thumbnail-pause-icon';
import SlidesThumbnailIcon from '@breakout/design-system/components/icons/slides-thumbnail-icon';

type IProps = {
  value?: DataSourceItemType | ThumbnailAssetData;
};

const AssetCellValue = ({ value }: IProps) => {
  // Thumbnail asset data
  if (value && 'asset_url' in value) {
    return (
      <div key={value.id} className="relative h-full max-h-48 w-full max-w-60 rounded ring-2 ring-gray-100">
        <VideoThumbnailPauseIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
        <img src={value.asset_url} alt="Thumbnail" className="h-full w-full rounded object-cover" />
      </div>
    );
  }

  if (!value || !value.public_url || !value.name || !value.type || !value.key) {
    return <div>No asset data</div>;
  }

  const { name, type, key, public_url } = value;
  switch (type) {
    case 'VIDEO':
      return (
        <div key={key} className="relative h-full max-h-48 w-full max-w-60 rounded ring-2 ring-gray-100">
          <VideoThumbnailPauseIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
          <video src={public_url} aria-label={name} className="h-full w-full rounded object-fill" />
        </div>
      );
    case 'IMAGE':
      return (
        <div key={key} className="relative h-full max-h-48 w-full max-w-60">
          <div className="absolute left-1 top-1 flex items-center justify-center rounded bg-system/60 p-1">
            <SlidesThumbnailIcon width={'12'} height={'12'} />
          </div>
          <img src={public_url} alt={name} className="h-full w-full rounded object-fill" />
        </div>
      );
    default:
      return <div>Unknown asset type</div>;
  }
};

export default AssetCellValue;
