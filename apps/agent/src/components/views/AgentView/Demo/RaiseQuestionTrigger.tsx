import RaiseHandDisabled from '@breakout/design-system/components/icons/RaiseHandDisabled';
import AskQuestion from './AskQuestion';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
  shouldShowDemoAgent: boolean;
  setShowDemoAgent: Dispatch<SetStateAction<boolean>>;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
}

const RaiseQuestionTrigger = ({ shouldShowDemoAgent, setShowDemoAgent, onRaiseDemoQuery }: IProps) => {
  const handleToggleAgent = () => {
    const currentState = !shouldShowDemoAgent;
    setShowDemoAgent(currentState);
    if (currentState) {
      onRaiseDemoQuery(currentState);
    }
  };

  //TODO: FIgure out when to call onCloseDemoAgent

  const handleCloseAgent = () => {
    setShowDemoAgent(false);
    onRaiseDemoQuery(false);
  };

  return (
    <div className="flex items-center justify-between">
      {shouldShowDemoAgent ? (
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-primary/60"
          onClick={handleCloseAgent}
        >
          <RaiseHandDisabled height={24} width={24} color="white" />
        </div>
      ) : (
        <div className="popup-banner-border-gradient-animation rounded-[50px] p-[2px]">
          <div className="rounded-[50px] bg-white">
            <AskQuestion onClick={handleToggleAgent} />
          </div>
        </div>
      )}
    </div>
  );
};

export { RaiseQuestionTrigger };
