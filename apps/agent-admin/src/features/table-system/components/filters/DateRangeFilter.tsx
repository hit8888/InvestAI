import { useState } from 'react';
import DateRangePicker from '@breakout/design-system/components/layout/DateRangePicker';
import ChoosePresetsDateValue from '../../../../components/ChoosePresetsDateValue';
import { DATE_RANGE_PRESET_OPTIONS } from '../../../../utils/constants';
import { PresetDateLabel, DateRangeProp } from '@meaku/core/types/admin/filters';
import { getDateAppliedValue } from '../../../../utils/common';
import type { FilterConfig, DateRangeValue } from '../../types';

interface DateRangeFilterProps {
  config: FilterConfig;
  value: DateRangeValue | null | undefined;
  onChange: (value: DateRangeValue | null) => void;
  onBack: () => void;
  onApply: () => void;
}

// Convert our DateRangeValue format to V1's DateRangeProp format
const convertToDateRangeProp = (value: DateRangeValue | null | undefined): DateRangeProp | undefined => {
  if (!value || (!value.from && !value.to)) return undefined;
  return {
    startDate: value.from ? new Date(value.from) : undefined,
    endDate: value.to ? new Date(value.to) : undefined,
  };
};

// Convert V1's DateRangeProp format back to our DateRangeValue format
const convertFromDateRangeProp = (dateRange: DateRangeProp | undefined): DateRangeValue | null => {
  if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) return null;
  return {
    from: dateRange.startDate ? dateRange.startDate.toISOString().split('T')[0] : null,
    to: dateRange.endDate ? dateRange.endDate.toISOString().split('T')[0] : null,
  };
};

/**
 * Date range filter component using V1 date picker
 * Only applies changes when Apply button is clicked
 */
export const DateRangeFilter = ({ value, onChange, onApply }: DateRangeFilterProps) => {
  // Local state - changes aren't applied until user clicks Apply
  const [dateRange, setDateRange] = useState<DateRangeProp | undefined>(convertToDateRangeProp(value));
  const [currentPreset, setCurrentPreset] = useState<PresetDateLabel>(PresetDateLabel.CustomRange);

  const onPresetAndCustomDateChange = (newDate: DateRangeProp | undefined, presetLabel: string) => {
    setCurrentPreset(presetLabel as PresetDateLabel);
    setDateRange(newDate);
    // Don't call onChange here - wait for Apply button
  };

  const handleDateRangeChange = (newDate: DateRangeProp | undefined) => {
    setDateRange(newDate);
    // Don't call onChange here - wait for Apply button
  };

  const handleApply = () => {
    // Apply the changes
    onChange(convertFromDateRangeProp(dateRange));
    onApply();
  };

  const displayDateRange = (dateRange: DateRangeProp | undefined) => {
    if (!dateRange?.startDate) return 'Pick date';
    return getDateAppliedValue(dateRange);
  };

  // Disable future dates (dates after today)
  const getDisabledDays = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return { after: today };
  };

  const isCustomRange = currentPreset === PresetDateLabel.CustomRange;

  return (
    <div className="flex h-full flex-col">
      {/* Date Range Picker - V1 Style */}
      <div className="flex w-full p-4">
        <ChoosePresetsDateValue
          currentPreset={currentPreset}
          onDateChange={onPresetAndCustomDateChange}
          options={DATE_RANGE_PRESET_OPTIONS}
        />
        <DateRangePicker
          key={`${currentPreset}-${dateRange?.startDate?.getTime()}-${dateRange?.endDate?.getTime()}`}
          isCustomRange={isCustomRange}
          date={dateRange}
          onDateChange={handleDateRangeChange}
          disabled={getDisabledDays()}
        />
      </div>

      {/* Footer */}
      <div className="mt-auto flex w-full items-center justify-between border-t border-gray-200 px-4 py-3">
        <p className="text-sm font-medium text-gray-400">{displayDateRange(dateRange)}</p>
        <div className="flex gap-4">
          <button
            onClick={handleApply}
            disabled={!dateRange?.startDate}
            className="rounded-md bg-gray-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
