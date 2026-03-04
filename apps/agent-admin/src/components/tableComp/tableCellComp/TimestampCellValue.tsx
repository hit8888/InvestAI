import { CellValueProps } from '@neuraltrade/core/types/admin/admin-table';
import DateUtil from '@neuraltrade/core/utils/dateUtils';

const TimestampCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const { getDateInHumanReadableFormat, formatDateTime } = DateUtil;
  const titleValue = formatDateTime(value);
  return (
    <span title={titleValue} className="w-full">
      {getDateInHumanReadableFormat(value)}
    </span>
  );
};

export default TimestampCellValue;
