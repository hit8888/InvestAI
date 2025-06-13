import { Dialog, DialogContent } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';

interface DialogsProps {
  showContinueDialog: boolean;
  setShowContinueDialog: (show: boolean) => void;
  isPlayingResponse: boolean;
  handleContinueSpeaking: () => void;
  handleContinueDemo: () => void;
}

export const IdleStateDialog = ({
  showContinueDialog,
  setShowContinueDialog,
  isPlayingResponse,
  handleContinueSpeaking,
  handleContinueDemo,
}: DialogsProps) => (
  <>
    <Dialog open={showContinueDialog && !isPlayingResponse} onOpenChange={setShowContinueDialog}>
      <DialogContent className="fixed left-1/2 top-1/2 max-w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-4">
        <div className="p-4">
          <Typography as="h3" className="mb-4" variant="title-18" textColor="textPrimary">
            Would you like to continue the demo?
          </Typography>
          <div className="mt-8 flex w-full justify-between gap-6">
            <Button variant="system_tertiary" onClick={handleContinueSpeaking}>
              Continue Speaking
            </Button>
            <Button onClick={handleContinueDemo}>Continue Demo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
);
