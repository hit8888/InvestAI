import { AvailabilitySettings } from '@calcom/atoms';
import toast from 'react-hot-toast';

const Availability = () => {
  return (
    <AvailabilitySettings
      enableOverrides
      onUpdateSuccess={() => {
        toast.success('Updated schedule successfully');
      }}
      onDeleteSuccess={() => {
        toast.success('Deleted schedule successfully');
      }}
      customClassNames={{
        containerClassName: '!px-0',
        subtitlesClassName: 'text-primary',
        ctaClassName: 'border p-4 rounded-md',
        editableHeadingClassName: 'underline font-semibold',
      }}
    />
  );
};

export default Availability;
