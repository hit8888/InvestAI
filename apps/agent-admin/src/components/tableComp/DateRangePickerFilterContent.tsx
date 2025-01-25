import { formatDateDisplay } from '../../utils/common';
import CustomDateRangePicker from '../CustomDateRangePicker';
import FooterButton from './FooterButton';
import React from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { PageTypeProps } from '../../utils/admin-types';
import { DateRangeProp, FilterType } from '@meaku/core/types/admin/filters';

type DateRangePickerFilterContentProps = PageTypeProps & {
  handleClosePopover: () => void;
};

const DateRangePickerFilterContent = ({ page, handleClosePopover }: DateRangePickerFilterContentProps) => {
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

  return (
    <React.Fragment key={DateRange}>
      <CustomDateRangePicker page={page} onDateChange={(newDate) => setDate(newDate)} date={date} />
      <div className="flex w-full items-center justify-between p-4">
        <p className="text-sm font-medium text-gray-400">{formatDateDisplay(date)}</p>
        <div className="flex gap-4">
          <FooterButton isClearAllBtn={true} showIcon={false} btnLabel="Cancel" onBtnClicked={handleCancelClicked} />
          <FooterButton showIcon={false} btnLabel="Apply Dates" onBtnClicked={handleApplyDates} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DateRangePickerFilterContent;
