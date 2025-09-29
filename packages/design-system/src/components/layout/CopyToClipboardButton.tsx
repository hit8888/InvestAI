import Button, { ButtonVariantTypes } from '../Button';
import { cn } from '../../lib/cn';
import ClipboardCopyIcon from '../icons/ClipboardCopyIcon';
import { CheckIcon } from 'lucide-react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import React from 'react';

type IProps = {
  textToCopy: string;
  toastMessage?: string;
  handleCopy?: () => void;
  copyIconClassname?: string;
  btnClassName?: string;
  btnVariant?: ButtonVariantTypes;
  getHtml?: () => string | null | undefined;
  children?: React.ReactNode;
};

const CopyToClipboardButton = ({
  textToCopy,
  toastMessage = '',
  handleCopy,
  copyIconClassname,
  btnClassName,
  btnVariant = 'system_tertiary',
  getHtml,
  children,
}: IProps) => {
  const defaultHtmlCopy = React.useCallback(async () => {
    const html = getHtml?.();
    if (!html) return;
    try {
      type ClipboardItemConstructor = new (items: Record<string, Blob>) => ClipboardItem;
      const clipboardItemCtor: ClipboardItemConstructor | undefined = (
        window as unknown as { ClipboardItem?: ClipboardItemConstructor }
      ).ClipboardItem;
      if (navigator.clipboard && 'write' in navigator.clipboard && clipboardItemCtor) {
        const item = new clipboardItemCtor({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([textToCopy], { type: 'text/plain' }),
        });
        await (navigator.clipboard as { write: (items: ClipboardItem[]) => Promise<void> }).write([item]);
      }
    } catch {
      // Swallow; plain text was already copied by the base handler
      // and we don't want to break UX for unsupported environments.
    }
  }, [getHtml, textToCopy]);

  const { isCopied, copy } = useCopyToClipboard(textToCopy, {
    toastMessage,
    onCopy: handleCopy ?? (getHtml ? defaultHtmlCopy : undefined),
  });

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation(); // Prevents the row click event
        copy();
      }}
      buttonStyle="icon"
      variant={btnVariant}
      className={cn('rounded-md bg-primary-foreground/70 p-0', btnClassName)}
    >
      {children}
      {isCopied ? (
        <CheckIcon className={cn('h-5 w-5 text-positive-1000', copyIconClassname)} />
      ) : (
        <ClipboardCopyIcon className={cn('h-5 w-5 text-primary ', copyIconClassname)} />
      )}
    </Button>
  );
};

export default CopyToClipboardButton;
