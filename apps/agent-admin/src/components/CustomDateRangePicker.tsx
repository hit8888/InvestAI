import { cn } from '@breakout/design-system/lib/cn';
import DateRangePicker from '@breakout/design-system/components/layout/DateRangePicker';
import ChoosePresetsDateValue from './ChoosePresetsDateValue';
import { DateRangeProp, FilterType, PageTypeProps, PresetDateLabel } from '@meaku/core/types/admin/filters';
import { useAllFilterStore } from '../stores/useAllFilterStore';

type CustomDateRangePickerProps = PageTypeProps & {
  date: DateRangeProp | undefined;
  onDateChange: (dateRange: DateRangeProp | undefined) => void;
};

const CustomDateRangePicker = ({ page, date, onDateChange }: CustomDateRangePickerProps) => {
  const { setFilter, [page]: pageFilters } = useAllFilterStore();

  const { CustomRange } = PresetDateLabel;
  const { PresetDate: PresetDateType } = FilterType;
  const currentPreset = (pageFilters?.presetDate as PresetDateLabel) ?? PresetDateLabel.CustomRange;

  const isCustomRange = currentPreset === CustomRange;

  const onPresetAndCustomDateChange = (newDate: DateRangeProp | undefined, presetLabel: string) => {
    setFilter(page, PresetDateType, presetLabel);
    onDateChange(newDate);
  };

  return (
    <div className={cn('flex w-full p-4')}>
      <ChoosePresetsDateValue currentPreset={currentPreset} onDateChange={onPresetAndCustomDateChange} />
      <DateRangePicker isCustomRange={isCustomRange} date={date} onDateChange={onDateChange} />
    </div>
  );
};

export default CustomDateRangePicker;
