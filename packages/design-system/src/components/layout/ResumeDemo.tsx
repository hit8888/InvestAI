import Button from '@breakout/design-system/components/Button/index';
import ResumeIcon from '@breakout/design-system/components/icons/ResumeIcon';
interface ResumeDemoProps {
  onResume: () => void;
  isPlayingResponse: boolean;
}

const ResumeDemo = ({ onResume, isPlayingResponse }: ResumeDemoProps) => {
  return (
    <Button
      onClick={() => {
        if (!isPlayingResponse) {
          onResume();
        }
      }}
      buttonStyle="rightIcon"
      variant="primary"
      disabled={isPlayingResponse}
      rightIcon={<ResumeIcon color="white" height={16} width={16} />}
    >
      <span className="whitespace-nowrap">Resume Demo</span>
    </Button>
  );
};

export default ResumeDemo;
