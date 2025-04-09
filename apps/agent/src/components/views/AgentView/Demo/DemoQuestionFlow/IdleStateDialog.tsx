import { Dialog, DialogContent, DialogTitle } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/layout/button';

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
      <DialogTitle></DialogTitle>

      <DialogContent className="fixed left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 bg-white p-4">
        <div className="p-4">
          <h3 className="mb-4 text-xl font-semibold text-customPrimaryText">Would you like to continue the demo?</h3>
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={handleContinueSpeaking}>Continue Speaking</Button>
            <Button onClick={handleContinueDemo}>Continue Demo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
);
