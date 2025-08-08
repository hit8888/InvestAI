// @ts-expect-error - Temporarily ignoring type errors until types are fixed
import { AvailabilitySettings } from '@calcom/atoms';
import { getBrowserTimezone } from './utils';

const Availability = () => {
  return (
    <AvailabilitySettings
      schedule={{
        name: 'Availability',
        id: 1,
        availability: [],
        isLastSchedule: false,
        isDefault: true,
        workingHours: [],
        dateOverrides: [],
        timeZone: getBrowserTimezone(),
        schedule: [],
      }}
      weekStart="monday"
      backPath="/"
      handleSubmit={async () => {}}
      handleDelete={() => {}}
      isDeleting={false}
      isSaving={false}
      isLoading={false}
      timeFormat={null}
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
