import { AvailabilitySettings } from '@calcom/atoms';
import toast from 'react-hot-toast';

export const Availability = () => {
  return (
    <div className="flex w-full flex-col gap-8">
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
