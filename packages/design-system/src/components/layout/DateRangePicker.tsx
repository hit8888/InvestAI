import { DateRange } from 'react-day-picker';
import { Calendar } from '../shadcn-ui/calendar';
import { DateRangePickerProps } from '@meaku/core/types/admin/filters';

const DateRangePicker = ({ date, onDateChange }: DateRangePickerProps) => {
  const handleSelect = (value: DateRange | undefined) => {
    onDateChange(value);
  };
  return (
    <Calendar
      className="!p-0"
      initialFocus
      mode="range"
      defaultMonth={date?.from}
      selected={date}
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
