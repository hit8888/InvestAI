import React from 'react';
import { EventTypeSettings } from '@calcom/atoms';
import toast from 'react-hot-toast';
import { EventType } from './EventTypeList';
import EventTypeHeader from './EventTypeHeader';

interface EventTypeSettingsViewProps {
  eventType: EventType;
  onBack: () => void;
  onDeleteSuccess?: () => void;
  onSaveSuccess?: () => void;
}

export const EventTypeSettingsView: React.FC<EventTypeSettingsViewProps> = ({
  eventType,
  onBack,
  onDeleteSuccess,
  onSaveSuccess,
}) => {
  const handleDeleteSuccess = () => {
    toast.success('Event type deleted successfully');
    onDeleteSuccess?.();
    onBack();
  };

  const handleSaveSuccess = () => {
    toast.success('Event type saved successfully');
    onSaveSuccess?.();
    onBack();
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-gray-50 rounded-2xl p-4">
      <EventTypeHeader
        onBack={onBack}
        title="Edit Event Type"
        description={`Configure settings for "${eventType.title || eventType.eventName || eventType.slug}"`}
      />

      <EventTypeSettings
        id={eventType.id}
        allowDelete={true}
        disableToasts={false}
        onSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
        customClassNames={{
          atomsWrapper: '!w-[70vw] !m-auto',
        }}
      />
    </div>
  );
};
