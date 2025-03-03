import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CopyToClipboardOptions {
  toastMessage?: string;
  onCopy?: () => void;
  copyDuration?: number;
}

export const useCopyToClipboard = (text: string, options: CopyToClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toastMessage = '', onCopy, copyDuration = 1000 } = options;

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, copyDuration);
      return () => clearTimeout(timer);
    }
  }, [isCopied, copyDuration]);

  const copy = () => {
    navigator.clipboard.writeText(text);
    if (onCopy) {
      onCopy();
    }
    if (toastMessage) {
      toast.success(toastMessage);
    }
    setIsCopied(true);
  };

  return { isCopied, copy };
};
