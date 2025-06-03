import { SourceNameValue } from '@meaku/core/types/admin/admin-table';
import DataSourcePdfIcon from '@breakout/design-system/components/icons/data-source-pdf-icon';
import { Link } from 'react-router-dom';

const SourceNameCellValue = ({ value }: { value: SourceNameValue }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded bg-bluegray-200 p-1">
        <DataSourcePdfIcon className="text-bluegray-700" width={16} height={16} />
      </div>
      <Link to={value.url} target="_blank" className="w-fit max-w-[400px] truncate text-blue_sec-1000">
        {value.name}
      </Link>
    </div>
  );
};

export default SourceNameCellValue;
