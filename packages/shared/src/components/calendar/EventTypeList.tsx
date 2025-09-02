import React from 'react';
import { Button } from '@meaku/saral';
import { EditIcon, PlusIcon } from 'lucide-react';

export interface EventType {
  id: number;
  title: string;
  slug: string;
  description?: string;
  userId: number;
  teamId?: number;
  eventName?: string;
  lengthInMinutes?: number;
}

interface EventTypeListProps {
  eventTypes: EventType[];
  onEditEventType: (eventType: EventType) => void;
  onCreateEventType: () => void;
  isLoading?: boolean;
}

export const EventTypeList: React.FC<EventTypeListProps> = ({
  eventTypes,
  onEditEventType,
  onCreateEventType,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl p-6">
      {eventTypes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <PlusIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">No event types yet</h3>
          <p className="text-sm text-gray-500 mb-4">Get started by creating your first event type</p>
          <Button variant="default" size="default" onClick={onCreateEventType} className="w-fit rounded-lg gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Event Type
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {eventTypes.map((eventType) => (
            <EventTypeCard key={eventType.id} eventType={eventType} onEdit={() => onEditEventType(eventType)} />
          ))}
          <div className="w-full flex justify-end">
            <Button variant="default" size="default" onClick={onCreateEventType} className="w-fit rounded-lg gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Event Type
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface EventTypeCardProps {
  eventType: EventType;
  onEdit: () => void;
}

const EventTypeCard: React.FC<EventTypeCardProps> = ({ eventType, onEdit }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{eventType.title}</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Call Duration: {eventType.lengthInMinutes} minutes
              </span>
            </div>
          </div>
          {eventType.description && <p className="text-sm text-gray-500 mt-1 truncate">{eventType.description}</p>}
          <p className="text-xs text-gray-400 mt-1">Event Slug: {eventType.slug}</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Button variant="outline" size="sm" onClick={onEdit} className="rounded-lg gap-2">
            <EditIcon className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
