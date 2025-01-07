import { cn } from '@breakout/design-system/lib/cn';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const MeetingStatusCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const isStatusBooked = value === 'Booked';
  const isStatusNotBooked = value === 'Not Booked';
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn('h-2 w-2 rounded-full', {
          'bg-customGreen1': isStatusBooked,
          'bg-customRed1': isStatusNotBooked,
        })}
      ></span>
      <span
        className={cn('text-sm font-normal capitalize', {
          'text-customGreen1': isStatusBooked,
          'text-customRed1': isStatusNotBooked,
        })}
      >
        {value}
      </span>
    </div>
  );
};

export default MeetingStatusCellValue;
