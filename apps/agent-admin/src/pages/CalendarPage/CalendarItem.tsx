import { useState } from 'react';
import { CalendarResponse, CalendarFormData } from '@meaku/core/types/admin/api';
import Card from '../../components/AgentManagement/Card';
import Typography from '@breakout/design-system/components/Typography/index';
import { Badge } from '@breakout/design-system/components/layout/badge';
import CalendarForm from './CalendarForm';
import { Link } from 'react-router-dom';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import { Pencil, X } from 'lucide-react';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import ExampleInfoIcon from '@breakout/design-system/components/icons/example-info-icon';
import { getBrowserTimezone } from './utils';

interface CalendarItemProps {
  calendar: CalendarResponse;
  onEdit: (calendarId: number, updates: Partial<CalendarFormData>) => void;
  onDelete: (calendarId: number) => void;
  onStartEdit: (calendarId: number) => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const CalendarItem = ({
  calendar,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
  isEditing,
  isUpdating,
  isDeleting,
}: CalendarItemProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = (data: CalendarFormData) => {
    onEdit(calendar.id, data);
  };

  const handleCancelEditLocal = () => {
    onCancelEdit();
  };

  const handleDelete = () => {
    onDelete(calendar.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
      <Card background="WHITE" border="GRAY200" className="p-4">
        <CalendarForm
          initialData={{
            name: calendar.name,
            calendar_type: calendar.calendar_type ?? 'CALENDLY',
            calendar_url: calendar.calendar_url ?? '',
            description: calendar.description ?? '',
            is_primary: calendar.is_primary ?? false,
            timezone: calendar.timezone ?? getBrowserTimezone(),
            metadata: calendar.metadata ?? {},
          }}
          onSubmit={handleEdit}
          onCancel={handleCancelEditLocal}
          isSubmitting={isUpdating}
          submitButtonText="Save Changes"
        />
      </Card>
    );
  }

  if (showDeleteConfirm) {
    return (
      <Card background="GRAY100" border="GRAY200" className="gap-1 rounded-lg p-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex w-full flex-col gap-2">
            <Typography variant="caption-12-medium">Are you sure ?</Typography>
            <Typography variant="caption-12-normal" textColor="textSecondary">
              This action cannot be undone.
            </Typography>
          </div>
          <div className="flex flex-col justify-end gap-3 pr-2">
            <button
              id={`calendar-${calendar.id}-delete-cancel-button`}
              type="button"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              <X width="16" height="16" className="text-gray-500" />
            </button>
            <button
              id={`calendar-${calendar.id}-delete-confirm-button`}
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <DeleteIcon width="16" height="16" className="text-destructive-1000" />
              )}
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card background="GRAY100" border="GRAY200" className="rounded-lg p-2">
      <div className="group flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <ExampleInfoIcon width={'16px'} height={'16px'} className="text-gray-500" />
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-2">
              <Typography title={calendar.name} variant="caption-12-medium" className="max-w-xs truncate">
                {calendar.name}
              </Typography>
              <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {calendar.is_primary && (
                  <Badge
                    variant="secondary"
                    className="bg-positive-200 text-xs text-positive-800 hover:bg-positive-200"
                  >
                    Primary
                  </Badge>
                )}
                {calendar.calendar_type && (
                  <Badge variant="outline" className="bg-white text-xs font-normal capitalize text-gray-500">
                    {calendar.calendar_type.toLowerCase()}
                  </Badge>
                )}
              </div>
            </div>
            {calendar.calendar_url && (
              <div className="flex w-full items-center gap-2">
                <Link
                  to={calendar.calendar_url}
                  target="_blank"
                  className="max-w-sm truncate text-sm text-gray-500 hover:text-blue_sec-1000 hover:underline"
                  title={calendar.calendar_url}
                  rel="noopener noreferrer"
                >
                  {calendar.calendar_url}
                </Link>
                <CopyToClipboardButton
                  copyIconClassname="text-gray-500"
                  btnClassName="bg-inherit h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:ring-none focus:outline-none focus:ring-0"
                  textToCopy={calendar.calendar_url}
                  btnVariant="tertiary"
                  toastMessage="URL copied"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 pr-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button id={`calendar-${calendar.id}-edit-button`} type="button" onClick={() => onStartEdit(calendar.id)}>
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
          <button id={`calendar-${calendar.id}-delete-button`} type="button" onClick={() => setShowDeleteConfirm(true)}>
            <DeleteIcon className="h-4 w-4 text-destructive-1000" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CalendarItem;
