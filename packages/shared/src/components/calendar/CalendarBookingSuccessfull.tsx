import { LucideIcon, Typography } from '@neuraltrade/saral';

interface IProps {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = 'Call Booked Successfully';
const DEFAULT_DESCRIPTION =
  'A confirmation email—complete with the meeting link and a calendar invite—is zipping to your inbox right now.';

export const CalendarBookingSuccessfull = ({ title, description }: IProps) => {
  const titleText = title || DEFAULT_TITLE;
  const descriptionText = description || DEFAULT_DESCRIPTION;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-full border-[16px] border-green-100 bg-green-500 p-2">
          <LucideIcon name="check" className="stroke-4 size-5  text-background" />
        </div>
        <Typography variant="heading" className="text-center">
          {titleText}
        </Typography>
        <Typography variant="body-small" className="text-center text-muted-foreground">
          {descriptionText}
        </Typography>
      </div>
    </div>
  );
};
