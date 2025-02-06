import Button from '@breakout/design-system/components/layout/button';
import { Dialog, DialogContent } from '@breakout/design-system/components/layout/dialog';
import { EndFlag } from '@breakout/design-system/components/icons/EndFlag';
import { useState } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

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
      <Button className="rounded-md bg-destructive-1000 px-4 py-2 text-white shadow-lg" onClick={handleOpen}>
        <span>Finish Demo</span>
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[420px] bg-white p-4">
          <div className="flex w-full flex-col items-center">
            <EndFlag />
            <span className="mb-1 mt-4 text-2xl font-semibold">End Demo Early?</span>
            Are you sure you want to end the demo? You can always restart it later or return to the chat to continue
            exploring our features.
          </div>
          <div className="mt-4 flex w-full justify-between gap-2">
            <Button
              className="flex-1 border-2 border-primary/60 bg-transparent px-12"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <span className="text-customSecondaryText">Cancel</span>
            </Button>
            <Button className="flex-1 border-2 border-red-400 bg-destructive-1000 px-12" onClick={handleFinishDemo}>
              <span>End Demo</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { FinishDemo };
