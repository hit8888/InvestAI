import { Dialog, DialogContent, DialogTrigger, LucideIcon } from '.';
import Typography from './typography';

interface ImageArtifactProps {
  title: string;
  url: string;
  onOverlayClick?: () => void;
}

export const ImageArtifact = ({ title, url, onOverlayClick }: ImageArtifactProps) => {
  if (!url) {
    return null;
  }

  return (
    <div className="relative min-h-[50%] w-full overflow-hidden rounded-lg border border-primary/10">
      {title && (
        <Typography className="bg-primary/10 p-2 px-3" variant="body-semibold">
          {title}
        </Typography>
      )}
      <img src={url} alt={title || 'Image'} className="h-auto w-full max-w-full object-contain" loading="lazy" />
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="absolute bottom-0 left-0 top-9 flex w-full items-center justify-center bg-foreground/40 opacity-0 transition-all hover:opacity-100"
            onClick={onOverlayClick}
          >
            <LucideIcon name="zoom-in" className="size-10 cursor-pointer  stroke-2 text-background" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[80vw] gap-0 overflow-hidden p-0 pb-2">
          {title && (
            <Typography className="bg-primary/10 p-3 px-4" variant="body-semibold">
              {title}
            </Typography>
          )}
          <div className="flex h-full items-center justify-center p-2">
            <img src={url} alt={title || 'Image'} className="h-full w-full rounded-lg object-contain" loading="lazy" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export type { ImageArtifactProps };
