import { DrawerClose } from '@breakout/design-system/components/Drawer/index';
import BuyerIntentCellValue from '../tableComp/tableCellComp/BuyerIntentCellValue';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';

type JoinConversationHeaderProps = {
  buyerIntentLabel: string;
  sessionId: string;
};

const JoinConversationHeader = ({ buyerIntentLabel, sessionId }: JoinConversationHeaderProps) => {
  return (
    <div className="flex w-full items-start justify-between px-4 py-0">
      <div className="flex flex-1 items-center gap-4">
        <BuyerIntentLabel buyerIntentLabel={buyerIntentLabel} />
        <SessionIdLabelWithCopyButton sessionId={sessionId} />
      </div>
      <DrawerClose className="flex items-end">
        <CrossIcon className="h-6 w-6 text-primary" />
      </DrawerClose>
    </div>
  );
};

const BuyerIntentLabel = ({ buyerIntentLabel }: { buyerIntentLabel: string }) => {
  return (
    <div className="flex items-start justify-center gap-2 rounded-lg bg-primary/5 p-2">
      <span className="text-base font-semibold text-primary">Buyer intent:</span>
      <BuyerIntentCellValue withDot value={buyerIntentLabel} />
    </div>
  );
};

const SessionIdLabelWithCopyButton = ({ sessionId }: { sessionId: string }) => {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 p-2">
      <span className="text-base font-semibold text-primary">Session ID:</span>
      <span className="text-base font-medium text-primary/60">{sessionId}</span>
      <CopyToClipboardButton
        textToCopy={sessionId}
        btnClassName="bg-primary/2.5 h-[28px] w-[28px] flex rounded-lg justify-center !p-1 items-center border border-primary/20"
        copyIconClassname="text-primary h-4 w-4"
      />
    </div>
  );
};

export default JoinConversationHeader;
