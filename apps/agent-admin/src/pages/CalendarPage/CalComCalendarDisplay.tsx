import GoogleConnect from './GoogleConnect';
import Availability from './Availability';

const CalComCalendarDisplay = () => {
  return (
    <div className="flex w-full min-w-full flex-col gap-4">
      <GoogleConnect />
      <Availability />
    </div>
  );
};

export default CalComCalendarDisplay;
