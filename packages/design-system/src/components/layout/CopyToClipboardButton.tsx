import Button from '../Button';
import { cn } from '../../lib/cn';
import ClipboardCopyIcon from '../icons/ClipboardCopyIcon';
import { CheckIcon } from 'lucide-react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

type IProps = {
  textToCopy: string;
  toastMessage?: string;
  handleCopy?: () => void;
  copyIconClassname?: string;
  btnClassName?: string;
};

const CopyToClipboardButton = ({
  textToCopy,
  toastMessage = '',
  handleCopy,
  copyIconClassname,
  btnClassName,
}: IProps) => {
  const { isCopied, copy } = useCopyToClipboard(textToCopy, {
    toastMessage,
    onCopy: handleCopy,
  });

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation(); // Prevents the row click event
        copy();
      }}
      buttonStyle="icon"
      variant="system_tertiary"
      className={cn('rounded-md bg-primary-foreground/70 p-0', btnClassName)}
    >
      {isCopied ? (
        <CheckIcon className="h-5 w-5 text-positive-1000" />
      ) : (
        <ClipboardCopyIcon className={cn('h-5 w-5 text-primary ', copyIconClassname)} />
      )}
    </Button>
  );
};

export default CopyToClipboardButton;
