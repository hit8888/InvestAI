import { Typography } from '@meaku/saral';
import { Connect } from '@calcom/atoms';
import { toast } from 'react-hot-toast';

export const GoogleConnect = () => {
  const redirectURL = window.location.href;
  return (
    <div className="flex w-full rounded-2xl border border-gray-200 bg-gray-25 flex-row items-center justify-between p-4">
      <Typography variant="body" className="text-gray-500">
        Connect your Google Calendar
      </Typography>
      <Connect.GoogleCalendar
        label="Connect"
        loadingLabel="Connecting..."
        onSuccess={() => {
          toast.success('Google Calendar connected successfully');
        }}
        redir={redirectURL}
        className="!bg-primary/90 text-center text-sm font-semibold transition-all duration-300 hover:!bg-primary"
      />
    </div>
  );
};
