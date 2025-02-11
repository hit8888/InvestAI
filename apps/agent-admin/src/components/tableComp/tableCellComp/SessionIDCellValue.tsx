import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import { COPIED_FIELD_TEXTS } from '../../../utils/constants';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const SessionIDCellValue: React.FC<CellValueProps> = ({ value }) => {
  return (
    <div className="flex items-center gap-2">
      <span title={value} className="w-32 truncate 2xl:w-40">
        {value}
      </span>
      <CopyToClipboardButton
        copyIconClassname="h-4 w-4"
        textToCopy={value}
        toastMessage={COPIED_FIELD_TEXTS.SESSION_ID}
      />
    </div>
  );
};

export default SessionIDCellValue;
