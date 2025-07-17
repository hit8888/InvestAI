// import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import { COPIED_FIELD_TEXTS } from '../../../utils/constants';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import CustomTooltipWithClipboardUsingHover from '../../CustomTooltipWithClipboardUsingHover';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';

type IProps = CellValueProps & {
  isTooltipWithClipboard: boolean;
};

const SessionIDCellValue: React.FC<IProps> = ({ value, isTooltipWithClipboard }) => {
  const getSessionIDCellValue = () => {
    return <span className="w-32 truncate 2xl:w-40">{value}</span>;
  };
  return isTooltipWithClipboard ? (
    <div className="flex items-center gap-2">
      {getSessionIDCellValue()}
      <CopyToClipboardButton btnClassName="h-4 w-4" textToCopy={value} toastMessage={COPIED_FIELD_TEXTS.SESSION_ID} />
    </div>
  ) : (
    <CustomTooltipWithClipboardUsingHover
      tooltipAlign="end"
      tooltipSide="top"
      tooltipText={value}
      toastMessage={COPIED_FIELD_TEXTS.SESSION_ID}
    >
      {getSessionIDCellValue()}
    </CustomTooltipWithClipboardUsingHover>
  );
};

export default SessionIDCellValue;
