import React from 'react';
import { CreateEventType } from '@calcom/atoms';
import EventTypeHeader from './EventTypeHeader';

interface CreateEventTypeViewProps {
  onBack: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (eventType: any) => void;
}

export const CreateEventTypeView: React.FC<CreateEventTypeViewProps> = ({ onBack, onSuccess }) => {
  return (
    <div className="flex flex-col gap-4 w-full bg-gray-50 rounded-2xl p-4">
      <EventTypeHeader
        onBack={onBack}
        title="Create New Event Type"
        description="Set up a new event type for your calendar"
      />

      <CreateEventType
        onSuccess={onSuccess}
        customClassNames={{
          atomsWrapper: 'border p-4 rounded-2xl bg-white',
        }}
      />
    </div>
  );
};
