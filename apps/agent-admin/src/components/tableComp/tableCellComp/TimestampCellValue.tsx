import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import DateUtil from '@meaku/core/utils/dateUtils';

const TimestampCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const { getDateInHumanReadableFormat, formatDateTime } = DateUtil;
  const titleValue = formatDateTime(value);
  return <span title={titleValue}>{getDateInHumanReadableFormat(value)}</span>;
};

export default TimestampCellValue;
