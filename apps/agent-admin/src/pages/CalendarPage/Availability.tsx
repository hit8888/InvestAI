import Typography from '@breakout/design-system/components/Typography/index';
import { AvailabilitySettings } from '@calcom/atoms';
import toast from 'react-hot-toast';

const Availability = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col gap-2">
        <Typography variant="title-18">Availability</Typography>
        <Typography variant="body-14" textColor="gray500">
          Manage your availability and schedule
        </Typography>
      </div>
      <AvailabilitySettings
        enableOverrides
        disableToasts
        onUpdateSuccess={() => {
          toast.success('Updated schedule successfully');
        }}
        onDeleteSuccess={() => {
          toast.success('Deleted schedule successfully');
        }}
        customClassNames={{
          containerClassName: 'bg-gray-25 w-full rounded-2xl border border-gray-200',
          subtitlesClassName: 'text-primary',
        }}
      />
    </div>
  );
};

export default Availability;
