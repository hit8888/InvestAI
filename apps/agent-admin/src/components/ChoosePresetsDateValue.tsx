import { DateRangeProp, PresetDateLabel } from '@meaku/core/types/admin/filters';
import SinglePresetDateValue from './SinglePresetDateValue';
import { DATE_RANGE_PRESET_OPTIONS } from '../utils/constants';

const ChoosePresetsDateValue = ({
  currentPreset,
  onDateChange,
}: {
  currentPreset: PresetDateLabel;
  onDateChange: (dateRange: DateRangeProp | undefined, presetValue: string) => void;
}) => {
  return (
    <div className="flex w-32 flex-col items-start gap-0.5">
      {DATE_RANGE_PRESET_OPTIONS.map((option) => (
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
