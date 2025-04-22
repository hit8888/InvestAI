import Button from '@breakout/design-system/components/Button/index';
import ResumeIcon from '@breakout/design-system/components/icons/ResumeIcon';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';

interface ResumeDemoProps {
  onResume: () => void;
  isPlayingResponse: boolean;
}

const ResumeDemo = ({ onResume, isPlayingResponse }: ResumeDemoProps) => {
  const invertTextColor = useConfigurationApiResponseManager().applyInvertTextColor();
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
