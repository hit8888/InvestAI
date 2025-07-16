import { COPIED_FIELD_TEXTS } from '../../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';
import CustomTooltipWithClipboardUsingHover from '../../CustomTooltipWithClipboardUsingHover';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';

type IProps = {
  value: string;
  valueOrientation?: 'right' | 'left';
};

const EmailCellValue: React.FC<IProps> = ({ value, valueOrientation = 'left' }) => {
  const isValueDash = value === '-';
  const isValueOrientationLeft = valueOrientation === 'left';
  const getEmailCellValue = () => {
    return (
      <span
        title={isValueOrientationLeft ? value : ''}
        className={cn('w-48 truncate 2xl:w-40', {
          'w-[90%] text-right 2xl:w-full': !isValueOrientationLeft,
        })}
      >
        {value}
      </span>
    );
  };
  return (
    <div
      className={cn('flex w-full items-center justify-end gap-2', {
        'justify-between': isValueOrientationLeft,
      })}
    >
      {isValueOrientationLeft ? (
        <>
          {getEmailCellValue()}
          {!isValueDash ? (
            <CopyToClipboardButton btnClassName="h-4 w-4" textToCopy={value} toastMessage={COPIED_FIELD_TEXTS.EMAIL} />
          ) : null}
        </>
      ) : (
        <CustomTooltipWithClipboardUsingHover
          tooltipText={value}
          toastMessage={COPIED_FIELD_TEXTS.EMAIL}
          showTooltip={!isValueDash}
        >
          {getEmailCellValue()}
        </CustomTooltipWithClipboardUsingHover>
      )}
    </div>
  );
};

export default EmailCellValue;
