import Typography from '@breakout/design-system/components/Typography/index';
import SingleSlideUploadDisplayItem from './SingleSlideUploadDisplayItem';
import SingleVideoUploadDisplayItem from './SingleVideoUploadDisplayItem';
import WebpagesSourcesIcon from '@breakout/design-system/components/icons/sources-webpages-icon';
import { DataSourceItem } from '@neuraltrade/core/types/admin/api';
import { useTextTruncation } from '@breakout/design-system/hooks/useTextTruncation';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import SingleDocumentUploadDisplayItem from './SingleDocumentUploadDisplayItem';

type DataSourceItemDisplayProps = {
  item: DataSourceItem | File;
  sourceType: string | null;
};

const DataSourceSingleItemDisplay = ({ item, sourceType }: DataSourceItemDisplayProps) => {
  switch (sourceType) {
    case 'webpages':
      return <SingleWebpageUploadDisplayItem item={item} />;
    case 'documents':
      return <SingleDocumentUploadDisplayItem item={item} />;
    case 'videos':
      return <SingleVideoUploadDisplayItem item={item} />;
    case 'slides':
      return <SingleSlideUploadDisplayItem item={item} />;
    default:
      return null;
  }
};

const SingleWebpageUploadDisplayItem = ({ item }: Pick<DataSourceItemDisplayProps, 'item'>) => {
  const dataSourceItem = item as DataSourceItem;
  const { public_url } = dataSourceItem;
  const { textRef, isTextTruncated } = useTextTruncation({
    text: public_url,
  });
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-2">
      <WebpagesSourcesIcon width="16" height="16" className="text-gray-500" />
      <TooltipWrapperDark
        tooltipSide="top"
        tooltipAlign="end"
        tooltipSideOffsetValue={15}
        trigger={
          <Typography ref={textRef} variant="body-14" className="max-w-xl truncate text-blue_sec-1000">
            {public_url}
          </Typography>
        }
        showTooltip={isTextTruncated}
        content={<p>{public_url}</p>}
      />
    </div>
  );
};

export default DataSourceSingleItemDisplay;
