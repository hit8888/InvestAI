import toast from 'react-hot-toast';
import Button from './button';
import { CopyIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type IProps = {
  textToCopy: string;
  toastMessage?: string;
  handleCopy?: () => void;
  copyIconClassname?: string;
};

const CopyToClipboardButton = ({ textToCopy, toastMessage='', handleCopy, copyIconClassname }: IProps) => {
  const handleCopyToClipboard = () => {
    if(handleCopy) {
        handleCopy();
    }
    navigator.clipboard.writeText(textToCopy);
    if(toastMessage.length) {
        toast.success(toastMessage);
    }
  };

  return (
    <Button onClick={(e) => {
        e.stopPropagation(); // Prevents the row click event
        handleCopyToClipboard();
      }} size="icon" className="rounded-md bg-primary-foreground/70 p-2 ">
      <CopyIcon className={cn("h-5 w-5 text-primary ", copyIconClassname)} />
    </Button>
  );
};

export default CopyToClipboardButton;
