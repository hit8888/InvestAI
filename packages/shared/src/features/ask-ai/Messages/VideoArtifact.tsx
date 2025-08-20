import { Button, Icons } from '@meaku/saral';
import { useSidebarArtifactContext } from '../context/SidebarArtifactContext';

interface VideoArtifactProps {
  title: string;
  url: string;
}

export const VideoArtifact = ({ title, url }: VideoArtifactProps) => {
  const { currentVideo, openSidebar, toggleVideoPlayPause } = useSidebarArtifactContext();

  const cleanUrl = (url: string): string => {
    return url.replace(/^@+/, '');
  };
  const cleanedUrl = cleanUrl(url);

  // Check if this specific video is currently open and playing
  const isThisVideoPlaying = currentVideo?.url === cleanedUrl && currentVideo?.isPlaying;

  const handleButtonClick = () => {
    if (currentVideo?.url === cleanedUrl) {
      // If this video is currently open, toggle play/pause
      toggleVideoPlayPause();
    } else {
      // If this video is not open, open sidebar and start playing
      openSidebar(cleanedUrl, 'VIDEO', title, true);
    }
  };

  const buttonClasses = isThisVideoPlaying
    ? 'h-7 rounded-2 gap-1 px-3 !bg-primary/15 !border !text-foreground'
    : 'h-7 rounded-[77px] gap-1 px-3';

  if (!cleanedUrl) {
    return null;
  }

  return (
    <div className="w-full">
      <Button
        className={`${buttonClasses} transition-all duration-300 min-w-[120px] min-h-[28px]`}
        onClick={handleButtonClick}
      >
        {isThisVideoPlaying ? (
          <Icons.Pause className="size-4 fill-primary stroke-0" />
        ) : (
          <div className="rounded-full bg-background p-1">
            <Icons.Play className="size-2.5 fill-foreground" />
          </div>
        )}
        {isThisVideoPlaying ? 'Video Playing' : 'Play Video'}
      </Button>
    </div>
  );
};

export type { VideoArtifactProps };
