import Button from '@breakout/design-system/components/Button/index';
import ResumeIcon from '@breakout/design-system/components/icons/ResumeIcon';

interface ResumeDemoProps {
  onResume: () => void;
  isPlayingResponse: boolean;
  invertTextColor?: boolean;
}

const ResumeDemo = ({ onResume, isPlayingResponse, invertTextColor }: ResumeDemoProps) => {
  return (
    <Button
      onClick={() => {
        if (!isPlayingResponse) {
          onResume();
        }
      }}
      buttonStyle="rightIcon"
      variant={invertTextColor ? 'inverted_primary' : 'primary'}
      disabled={isPlayingResponse}
      rightIcon={<ResumeIcon color={invertTextColor ? 'black' : 'white'} height={16} width={16} />}
    >
      <span className="whitespace-nowrap">Resume Demo</span>
    </Button>
  );
};

export default ResumeDemo;
