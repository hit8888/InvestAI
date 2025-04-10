import Button from '@breakout/design-system/components/Button/index';
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
      variant="primary"
      disabled={isPlayingResponse}
    >
      <span className="whitespace-nowrap">Resume Demo</span>
    </Button>
  );
};
