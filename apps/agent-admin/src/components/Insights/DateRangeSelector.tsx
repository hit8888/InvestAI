import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import FooterButton from '../tableComp/FooterButton';
import DateRangePicker from '@breakout/design-system/components/layout/DateRangePicker';
import { getDateAppliedValue } from '../../utils/common';
import { DateRangeProp, PresetDateLabel } from '@meaku/core/types/admin/filters';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ChoosePresetsDateValue from '../ChoosePresetsDateValue';
import moment from 'moment-timezone';

const ALLOWED_MONTHS_RANGE = 3;

interface IDateRangeSelectorProps {
  currentDateRange: DateRangeProp | undefined;
  onDateChange: (dateRange: DateRangeProp | undefined) => void;
}

const DateRangeSelector = ({ currentDateRange, onDateChange }: IDateRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeProp | undefined>();
  const [currentPreset, setCurrentPreset] = useState<PresetDateLabel>(PresetDateLabel.CustomRange);
  const { CustomRange } = PresetDateLabel;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApplyDates = () => {
    onDateChange(dateRange);
    handleClose();
  };

  const displayDateRange = (dateRange: DateRangeProp | undefined) => {
    if (!dateRange?.startDate) return 'Choose date range';
    return getDateAppliedValue(dateRange);
  };

  const onPresetAndCustomDateChange = (newDate: DateRangeProp | undefined, presetLabel: string) => {
    setCurrentPreset(presetLabel as PresetDateLabel);
    setDateRange(newDate);
  };

  const getDisabledDays = () => {
    const anyFutureDate = moment().subtract(1, 'day');

    if (dateRange?.startDate && !dateRange?.endDate) {
      const monthsBeforeStartDate = moment(dateRange.startDate).subtract(ALLOWED_MONTHS_RANGE, 'months');
      const monthsAfterStartDate = moment(dateRange.startDate).add(ALLOWED_MONTHS_RANGE, 'months');

      return {
        before: monthsBeforeStartDate.toDate(),
        after: monthsAfterStartDate.isAfter(anyFutureDate) ? anyFutureDate.toDate() : monthsAfterStartDate.toDate(),
      };
    }

    return { after: anyFutureDate.toDate() };
  };

  const Icon = isOpen ? ChevronUp : ChevronDown;
  const isCustomRange = currentPreset === CustomRange;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={`flex items-center gap-2 self-stretch rounded-lg border border-gray-200 bg-gray-25 p-2 outline-none ${isOpen ? 'ring-4 ring-gray-200' : ''}`}
      >
        <p className="text-sm font-medium text-gray-500">{displayDateRange(currentDateRange)}</p>
        <Icon size={16} className="text-bluegray-1000" />
      </PopoverTrigger>

      <PopoverContent
        className={`popover-boxshadow z-[100] rounded-lg bg-white p-0`}
        align="end"
        side="bottom"
        sideOffset={8}
        onPointerDownOutside={handleClose}
      >
        <div className="flex w-full p-4">
          <ChoosePresetsDateValue currentPreset={currentPreset} onDateChange={onPresetAndCustomDateChange} />
          <DateRangePicker
            isCustomRange={isCustomRange}
            date={dateRange}
            onDateChange={setDateRange}
            disabled={getDisabledDays()}
            defaultMonth={moment().subtract(1, 'month').toDate()}
          />
        </div>
        <div className="flex w-full items-center justify-between p-4">
          <p className="text-sm font-medium text-gray-400">{displayDateRange(dateRange)}</p>
          <div className="flex gap-4">
            <FooterButton isClearAllBtn={true} showIcon={false} btnLabel="Cancel" onBtnClicked={handleClose} />
            <FooterButton showIcon={false} btnLabel="Apply Dates" onBtnClicked={handleApplyDates} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
