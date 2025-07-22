import { DateRangeProp, PresetDateLabel } from '@meaku/core/types/admin/filters';
import SinglePresetDateValue from './SinglePresetDateValue';
import { DATE_RANGE_PRESET_OPTIONS } from '../utils/constants';

const ChoosePresetsDateValue = ({
  currentPreset,
  onDateChange,
  options = DATE_RANGE_PRESET_OPTIONS,
}: {
  currentPreset: PresetDateLabel;
  onDateChange: (dateRange: DateRangeProp | undefined, presetValue: string) => void;
  options?: typeof DATE_RANGE_PRESET_OPTIONS;
}) => {
  return (
    <div className="flex w-32 flex-col items-start gap-0.5">
      {options.map((option) => (
        <SinglePresetDateValue
          key={option.label}
          presetValue={option.value}
          presetLabel={option.label}
          currentPreset={currentPreset}
          onDateChange={onDateChange}
        />
      ))}
    </div>
  );
};

export default ChoosePresetsDateValue;
