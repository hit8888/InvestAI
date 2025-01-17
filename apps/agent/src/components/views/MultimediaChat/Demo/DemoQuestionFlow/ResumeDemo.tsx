import Button from '@breakout/design-system/components/layout/button';

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
      className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-primary/90"
      disabled={isPlayingResponse}
    >
      <span>Resume Demo</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Button>
  );
};
