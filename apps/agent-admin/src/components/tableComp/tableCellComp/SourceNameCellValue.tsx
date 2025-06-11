import { SourceNameValue } from '@meaku/core/types/admin/admin-table';
import DataSourcePdfIcon from '@breakout/design-system/components/icons/data-source-pdf-icon';
import { Link } from 'react-router-dom';
import Typography from '@breakout/design-system/components/Typography/index';

const URL_REGEX = /^https?:\/\//i;

const SourceNameCellValue = ({ value }: { value: SourceNameValue }) => {
  const { name, url } = value;

  const isUrl = url.length > 0 && URL_REGEX.test(url);
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded bg-bluegray-200 p-1">
        <DataSourcePdfIcon className="text-bluegray-700" width={16} height={16} />
      </div>
      {isUrl ? (
        <Link to={url} target="_blank" className="w-fit max-w-[400px] truncate text-blue_sec-1000">
          {name}
        </Link>
      ) : (
        <Typography variant="body-14" className="w-fit max-w-[400px] truncate">
          {name}
        </Typography>
      )}
    </div>
  );
};

export default SourceNameCellValue;
