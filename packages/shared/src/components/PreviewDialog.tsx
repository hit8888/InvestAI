import { Dialog, DialogContent, DialogTrigger, Typography, DialogProps } from '@meaku/saral';
import { cn } from '@meaku/saral';

interface PreviewDialogProps extends DialogProps {
  title?: string;
  trigger?: React.ReactNode;
  className?: string;
}

const PreviewDialog = ({ title, trigger, children, className, ...props }: PreviewDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn('flex h-[85vh] max-h-[85vh] max-w-[80vw] flex-col gap-0 overflow-hidden p-0', className)}
      >
        {title && (
          <Typography className="flex-none bg-primary/10 p-3 px-4" variant="body-semibold">
            {title}
          </Typography>
        )}
        <div className="min-h-0 flex-1 overflow-hidden p-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
