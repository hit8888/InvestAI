import CustomDateRangePicker from '../CustomDateRangePicker';
import FooterButton from './FooterButton';
import React from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { FilterType, DateRangeProp, CommonFilterContentPropsWithoutFilterState } from '@neuraltrade/core/types/admin/filters';
import { getDateAppliedValue } from '../../utils/common';

const DateRangePickerFilterContent = ({ page, handleClosePopover }: CommonFilterContentPropsWithoutFilterState) => {
  const filters = useAllFilterStore();
  const { DateRange } = FilterType;
  const [date, setDate] = React.useState<DateRangeProp | undefined>(filters[page].dateRange);

  const handleCancelClicked = () => {
    handleClosePopover();
  };

  const handleApplyDates = () => {
    filters.setFilter(page, DateRange, date);
    handleClosePopover();
  };

  const displayDateRange = (dateRange: DateRangeProp | undefined) => {
    if (!dateRange?.startDate) return 'Pick date'; // Return placeholder if no date is provided
    return getDateAppliedValue(dateRange);
  };

  return (
    <React.Fragment key={DateRange}>
      <CustomDateRangePicker page={page} onDateChange={(newDate) => setDate(newDate)} date={date} />
      <div className="flex w-full items-center justify-between p-4">
        <p className="text-sm font-medium text-gray-400">{displayDateRange(date)}</p>
        <div className="flex gap-4">
          <FooterButton isClearAllBtn={true} showIcon={false} btnLabel="Cancel" onBtnClicked={handleCancelClicked} />
          <FooterButton showIcon={false} btnLabel="Apply Dates" onBtnClicked={handleApplyDates} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DateRangePickerFilterContent;
