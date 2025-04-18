import Button from '@breakout/design-system/components/Button/index';
import { Dialog, DialogContent } from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import Typography from '@breakout/design-system/components/Typography/index';

interface IProps {
  onFinishDemo: () => void;
  onPause: () => void;
}

const FinishDemo = ({ onFinishDemo, onPause }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => {
    onPause();
    setIsModalOpen(true);
  };

  const handleFinishDemo = () => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_ABANDONED);
    onFinishDemo();
  };

  return (
    <>
      <Button variant="destructive" onClick={handleOpen}>
        Finish Demo
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[420px] bg-white p-4">
          <div className="flex w-full flex-col items-center">
            <Typography as="span" className="mb-1 mt-4" variant="title-24" textColor="textPrimary">
              End Demo Early?
            </Typography>
            <Typography as="span" variant="body-16" textColor="textSecondary">
              Are you sure you want to end the demo? You can always restart it later or return to the chat to continue
              exploring our features.
            </Typography>
          </div>
          <div className="mt-4 flex w-full justify-between gap-6">
            <Button
              className="flex-1 px-12"
              variant="system_secondary"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <span className="text-customSecondaryText">Cancel</span>
            </Button>
            <Button className="flex-1 px-12" onClick={handleFinishDemo}>
              End Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { FinishDemo };
