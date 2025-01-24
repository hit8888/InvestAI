import { cn } from '@breakout/design-system/lib/cn';
import { DateRangeProp, PresetDateLabel } from '@meaku/core/types/admin/filters';
import { addDays } from 'date-fns';

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
      onClick={
        /* eslint-disable @typescript-eslint/no-explicit-any */
        () => onDateChange({ from: addDays(new Date(), parseInt(presetValue) as any), to: new Date() }, presetLabel)
      }
      className={cn('flex items-center self-stretch rounded-l-[4px] px-3 py-2 hover:bg-primary/20', {
        'border-r-2 border-primary bg-primary/10 ': currentPreset === presetLabel,
      })}
    >
      <p className="flex-1 text-left text-xs font-normal text-gray-400">{presetLabel}</p>
    </button>
  );
};

export default SinglePresetDateValue;
