import { Dialog, DialogContent, DialogTrigger, Typography, DialogProps } from '@meaku/saral';
import { cn } from '@meaku/saral';
import { useModalPortal } from '../hooks/usePortal';

interface PreviewDialogProps extends DialogProps {
  title?: string;
  trigger?: React.ReactNode;
  className?: string;
  width?: string;
  maxWidth?: string;
}

const PreviewDialog = ({ title, trigger, children, className, width, maxWidth, ...props }: PreviewDialogProps) => {
  const { renderInPortal } = useModalPortal();

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {renderInPortal(
        <DialogContent
          className={cn(
            'flex h-[90vh] max-h-[calc(100vh-32px)] flex-col gap-0 overflow-hidden p-0',
            !width && 'max-w-[80vw] w-[-webkit-fill-available]',
            className,
          )}
          style={{
            ...(width && { width }),
            ...(maxWidth && { maxWidth }),
          }}
        >
          {title && (
            <Typography className="flex-none bg-primary/10 p-3 px-4" variant="body-semibold">
              {title}
            </Typography>
          )}
          <div className="min-h-0 flex-1 overflow-hidden p-2">{children}</div>
        </DialogContent>,
      )}
    </Dialog>
  );
};

export default PreviewDialog;
