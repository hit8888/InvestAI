import GreenTickIcon from '../icons/green-tick-icon';
import Typography from '../Typography';

const CalendarBookingSuccessfull = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-[20px] bg-white py-9">
      <div className="flex items-start rounded-full bg-positive-100 p-6">
        <GreenTickIcon className="h-12 w-12" />
      </div>
      <div className="flex max-w-lg flex-col items-center gap-2 p-4">
        <Typography variant="title-18" align="center">
          Call Booked Successfully
        </Typography>
        <Typography variant="body-14" align="center" textColor="gray500">
          A confirmation email—complete with the meeting link and a calendar invite—is zipping to your inbox right now.
        </Typography>
      </div>
    </div>
  );
};

export default CalendarBookingSuccessfull;
