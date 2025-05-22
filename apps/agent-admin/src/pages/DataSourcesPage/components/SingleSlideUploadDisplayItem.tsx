import SlidesThumbnailIcon from '@breakout/design-system/components/icons/slides-thumbnail-icon';
import SlidesSourcesIcon from '@breakout/design-system/components/icons/sources-slides-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { DataSourceItem } from '@meaku/core/types/admin/api';

type IProps = {
  item: DataSourceItem | File;
};

const SingleSlideUploadDisplayItem = ({ item }: IProps) => {
  const dataSourceItem = item as DataSourceItem;
  const { type, name } = dataSourceItem;

  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
      {'type' in item ? (
        <div className="relative h-12 w-20">
          <div className="absolute left-1 top-1 flex items-center justify-center rounded bg-system/60 p-1">
            <SlidesThumbnailIcon width={'12'} height={'12'} />
          </div>
          <img
            src={URL.createObjectURL(item as File)}
            alt={(item as File).name}
            className="h-full w-full rounded object-fill"
          />
        </div>
      ) : (
        <SlidesSourcesIcon width="16" height="16" className="text-gray-500" />
      )}
      <div className="flex flex-col">
        <Typography variant="body-14" className="max-w-lg truncate text-system">
          {name}
        </Typography>
        <Typography variant="caption-12-normal" className="text-gray-500">
          {type.split('/')[1]}
        </Typography>
      </div>
    </div>
  );
};

export default SingleSlideUploadDisplayItem;
