import GoogleConnect from './GoogleConnect';
import Availability from './Availability';

const CalComCalendarDisplay = () => {
  return (
    <div className="flex w-full min-w-full flex-col gap-8">
      <GoogleConnect />
      <Availability />
    </div>
  );
};

export default CalComCalendarDisplay;
