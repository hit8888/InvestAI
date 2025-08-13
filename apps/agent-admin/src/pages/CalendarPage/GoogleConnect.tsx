import Card from '../../components/AgentManagement/Card';
import Typography from '@breakout/design-system/components/Typography/index';
import { Connect } from '@calcom/atoms';
import { toast } from 'react-hot-toast';

const GoogleConnect = () => {
  const redirectURL = window.location.href;
  return (
    <Card background="GRAY25" border="GRAY200" className="flex w-full flex-row items-center justify-between p-4">
      <Typography variant="body-14" textColor="gray500">
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
    </Card>
  );
};

export default GoogleConnect;
