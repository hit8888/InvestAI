import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import { COPIED_FIELD_TEXTS } from '../../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';

type IProps = {
  value: string;
  valueOrientation?: 'right' | 'left';
};

const EmailCellValue: React.FC<IProps> = ({ value, valueOrientation = 'left' }) => {
  const isValueDash = value === '-';
  const isValueOrientationLeft = valueOrientation === 'left';
  return (
    <div
      className={cn('flex items-center gap-2', {
        'w-full justify-between': isValueOrientationLeft,
      })}
    >
      <span
        title={value}
        className={cn('w-48 truncate 2xl:w-40', {
          'text-right': !isValueOrientationLeft,
        })}
      >
        {value}
      </span>
      {!isValueDash ? (
        <CopyToClipboardButton copyIconClassname="h-4 w-4" textToCopy={value} toastMessage={COPIED_FIELD_TEXTS.EMAIL} />
      ) : null}
    </div>
  );
};

export default EmailCellValue;
