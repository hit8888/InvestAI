import { Button, LucideIcon, ThreeStarInsideOrbIcon, ShiningRectangle } from '@meaku/saral';

interface DemoLibraryCTAsProps {
  onBookMeetingClick: () => void;
  onAskAIClick: () => void;
  orbConfig?: {
    show_orb?: boolean | null;
    logo_url?: string | null;
  };
  showBookMeeting?: boolean;
  isLoading?: boolean;
}

export const DemoLibraryCTAs = ({
  onBookMeetingClick,
  onAskAIClick,
  orbConfig,
  showBookMeeting = true,
  isLoading = false,
}: DemoLibraryCTAsProps) => {
  // Show shimmer when loading
  if (isLoading) {
    return (
      <div className="flex gap-3 px-1 flex-shrink-0">
        {showBookMeeting && <div className="w-full h-9 bg-gray-200 rounded-[12px] animate-pulse"></div>}
        <div className="w-full h-9 bg-gray-200 rounded-[12px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-1 flex-shrink-0">
      {showBookMeeting && (
        <Button
          variant="default"
          size="sm"
          hasWipers={true}
          className="w-full flex !font-normal items-center justify-center gap-2 rounded-[12px]"
          onClick={onBookMeetingClick}
        >
          <LucideIcon name="calendar" className="h-4 w-4" />
          Book a Demo
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        hasWipers={true}
        className="w-full hover:!bg-background !font-normal text-muted-foreground flex items-center justify-center gap-2 rounded-[12px]"
        onClick={onAskAIClick}
      >
        Have Questions?
        <span className="text-primary flex items-center gap-1">
          Try Ask AI
          {!orbConfig?.show_orb ? (
            <img src={orbConfig?.logo_url ?? undefined} alt="Ask AI" className="h-4 w-4 rounded-full object-cover" />
          ) : (
            <div className="relative h-4 w-4 overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/10 to-transparent blur-sm" />
              <div className="relative inset-0 z-10 flex flex-col items-center justify-center">
                <ShiningRectangle width={8} height={4} />
                <div className="relative -top-0.5">
                  <ThreeStarInsideOrbIcon width={10} height={8} />
                </div>
              </div>
            </div>
          )}
        </span>
      </Button>
    </div>
  );
};
