import { trackError } from '@meaku/core/utils/error';
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

  const copy = async () => {
    let successful = false;
    try {
      // Try using Clipboard API first
      await navigator.clipboard.writeText(text);
      successful = true;
    } catch (err) {
      trackError(err, {
        action: 'copy',
        component: 'useCopyToClipboard',
        additionalData: {
          copiedText: text,
          error: err,
        },
      });

      // Fallback to execCommand if Clipboard API is not supported
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        successful = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (execErr) {
        successful = false;
        trackError(execErr, {
          action: 'copyExecFallback',
          component: 'useCopyToClipboard',
          additionalData: { copiedText: text, error: execErr },
        });
      }
    }

    if (successful && onCopy) {
      onCopy();
    }
    if (successful && toastMessage) {
      toast.success(toastMessage);
    }
    setIsCopied(successful);
  };

  return { isCopied, copy };
};
