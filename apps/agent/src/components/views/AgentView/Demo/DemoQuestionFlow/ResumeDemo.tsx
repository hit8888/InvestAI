import Button from '@breakout/design-system/components/layout/button';
import ResumeIcon from '@breakout/design-system/components/icons/ResumeIcon';
interface ResumeDemoProps {
  onResume: () => void;
  isPlayingResponse: boolean;
}

export const ResumeDemo = ({ onResume, isPlayingResponse }: ResumeDemoProps) => {
  return (
    <Button
      onClick={() => {
        if (!isPlayingResponse) {
          onResume();
        }
      }}
      className="flex h-10 min-w-max items-center justify-center gap-2 rounded-md bg-primary px-4  text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
      disabled={isPlayingResponse}
    >
      <span className="whitespace-nowrap">Resume the demo</span>
      <ResumeIcon color="white" height={16} width={16} />
    </Button>
  );
};
