import Typography from '@breakout/design-system/components/Typography/index';

interface CalendarHeaderProps {
  title: string;
  description: string;
}

const CalendarHeader = ({ title, description }: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-1 self-stretch">
      <Typography variant="label-16-semibold" className="text-gray-900">
        {title}
      </Typography>
      <Typography variant="body-14" className="text-gray-700">
        {description}
      </Typography>
    </div>
  );
};

export default CalendarHeader;
