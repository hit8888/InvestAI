import { SelectRangeEventHandler } from 'react-day-picker';
import { Calendar } from '../shadcn-ui/calendar';
import { DateRangePickerProps, DateRangeProp } from '@meaku/core/types/admin/filters';

const DateRangePicker = ({ date, onDateChange }: DateRangePickerProps) => {
  const handleSelect: SelectRangeEventHandler = (range) => {
    const value: DateRangeProp | undefined = range
      ? { startDate: range.from, endDate: range.to }
      : undefined;
    onDateChange(value);
  };
  return (
    <Calendar
      className="!p-0"
      initialFocus
      mode="range"
      defaultMonth={date?.startDate}
      selected={date ? { from: date.startDate, to: date.endDate } : undefined}
      onSelect={handleSelect}
      numberOfMonths={2}
      formatters={{
        formatWeekdayName: (date) => {
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
      }}
    />
  )
};

export default DateRangePicker;
