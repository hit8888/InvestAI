import Button from '../../Button';
import ArrowRight from '../../icons/ArrowRight';
import CalendarIcon from '../../icons/calendar-icon';
import Typography from '../../Typography';

const CalendarArtifactPreview = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="flex w-full max-w-[424px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 ring-system hover:bg-transparent_gray_6"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 p-1">
        <CalendarIcon height={24} width={24} />
      </div>
      <Typography variant="label-16-semibold" className="flex-1">
        Meeting Details
      </Typography>
      <Button variant="system_secondary" className="p-2">
        <ArrowRight className="text-gray-600" width="16" height="16" />
      </Button>
    </div>
  );
};

export default CalendarArtifactPreview;
