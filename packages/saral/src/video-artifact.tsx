import { Dialog, DialogContent, DialogTrigger, LucideIcon } from '.';
import Typography from './typography';
import { useRef, useEffect, useState } from 'react';

interface VideoArtifactProps {
  title: string;
  url: string;
  showControls?: boolean;
  onOverlayClick?: () => void;
}

export const VideoArtifact = ({ title, url, showControls = false, onOverlayClick }: VideoArtifactProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isDialogOpen && videoRef.current) {
      // Small delay to ensure the video element is fully rendered
      const timer = setTimeout(() => {
        if (videoRef.current) {
          // Set muted to true to allow autoplay (browsers require this)
          videoRef.current.muted = true;
          videoRef.current.play().catch((error) => {
            console.warn('Failed to autoplay video:', error);
            // If autoplay fails, we can try to unmute and play again
            // but this will likely still fail due to browser policies
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isDialogOpen]);

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
      <video
        controls={showControls}
        className="h-auto w-full max-w-full object-contain"
        preload="metadata"
        title={title}
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        <source src={url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            className="absolute bottom-0 left-0 top-9 flex w-full items-center justify-center bg-foreground/40 opacity-0 transition-all hover:opacity-100"
            onClick={onOverlayClick}
          >
            <LucideIcon name="play" className="size-10 cursor-pointer fill-background text-background" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[80vw] gap-0 overflow-hidden p-0 pb-2">
          {title && (
            <Typography className="bg-primary/10 p-3 px-4" variant="body-semibold">
              {title}
            </Typography>
          )}
          <div className="flex h-full items-center justify-center p-2">
            <video
              ref={videoRef}
              controls
              className="h-full w-full object-cover"
              preload="metadata"
              title={title}
              muted
              autoPlay
            >
              <source src={url} type="video/mp4" />
              <source src={url} type="video/webm" />
              <source src={url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export type { VideoArtifactProps };
