import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '../../lib/cn';
import DatePreviousArrow from '../icons/date-previous-arrow';
import DateNextArrow from '../icons/date-next-arrow';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-3 !pl-4 border-l border-gray-200',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium text-gray-900',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          // buttonVariants({ variant: "outline" }),
          'h-8 w-8 bg-transparent p-0',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: cn(
          'text-muted-foreground py-2 px-0.5 rounded-md w-8 font-normal text-[0.8rem]',
          '[&:nth-child(1)]:text-gray-400 [&:nth-child(7)]:text-gray-400', // Weekend header color
        ),
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
          // Align dates properly when outside days are hidden
          '[&:has(>.outside-month)]:invisible [&:has(>.outside-month)]:pointer-events-none',
        ),
        day: cn(
          // buttonVariants({ variant: "ghost" }),
          'h-8 w-8 flex items-center justify-center font-normal aria-selected:opacity-100 text-gray-900 bg-background',
          '[&.weekend:not([aria-selected])]:text-gray-400 [&.weekend:not([aria-selected])]:bg-background', // Weekend dates color
        ),
        day_range_start: 'day-range-start rounded-l-lg !bg-gray-900 !text-white hover:!bg-gray-900 hover:!text-white',
        day_range_end: 'day-range-end rounded-r-lg !bg-gray-900 !text-white hover:!bg-gray-900 hover:!text-white',
        day_selected: 'focus:bg-gray-900 focus:text-white',
        day_today: 'text-gray-800',
        day_outside: 'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: '!bg-gray-200 !text-gray-900',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <DatePreviousArrow color="rgb(31 41 55)" className="h-6 w-6" />,
        IconRight: () => <DateNextArrow color="rgb(31 41 55)" className="h-6 w-6" />,
      }}
      modifiers={{
        weekend: (date) => date.getDay() === 0 || date.getDay() === 6,
      }}
      modifiersClassNames={{
        weekend: 'weekend',
        outside: 'outside-month',
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
