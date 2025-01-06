import Button from '@breakout/design-system/components/layout/button';
import { Dialog, DialogContent } from '@breakout/design-system/components/layout/dialog';
import { EndFlag } from '@breakout/design-system/components/icons/EndFlag';
import { useState } from 'react';

interface IProps {
  onFinishDemo: () => void;
  onPause: () => void;
}

const FinishDemo = ({ onFinishDemo, onPause }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => {
    onPause();
    setIsModalOpen(true);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button className="bg-customRed1" onClick={handleOpen}>
        <div className="flex items-center gap-2">
          <span>Finish Demo</span>
        </div>
      </Button>
      <DialogContent className="w-[420px] bg-white p-4">
        <div className="flex w-full  flex-col items-center">
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
          <Button className="flex-1 border-2 border-red-400 bg-customRed1 px-12" onClick={onFinishDemo}>
            <span>End Demo</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { FinishDemo };
