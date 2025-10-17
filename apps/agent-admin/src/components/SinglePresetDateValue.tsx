import { cn } from '@breakout/design-system/lib/cn';
import { DateRangeProp, PresetDateLabel } from '@meaku/core/types/admin/filters';
import DateUtil from '@meaku/core/utils/dateUtils';

const SinglePresetDateValue = ({
  presetValue,
  presetLabel,
  currentPreset,
  onDateChange,
}: {
  presetValue: string;
  presetLabel: string;
  currentPreset: PresetDateLabel;
  onDateChange: (dateRange: DateRangeProp | undefined, presetValue: string) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onDateChange(DateUtil.getDateRangeForPresetValue(parseInt(presetValue)), presetLabel)}
      className={cn('flex items-center self-stretch rounded-l-[4px] px-3 py-2 hover:bg-gray-50', {
        'border-r-2 border-black bg-white': currentPreset === presetLabel,
      })}
    >
      <p
        className={cn('text-accent flex-1 text-left text-xs font-normal', {
          'text-gray-800': currentPreset === presetLabel,
          'text-gray-400': currentPreset !== presetLabel,
        })}
      >
        {presetLabel}
      </p>
    </button>
  );
};

export default SinglePresetDateValue;
