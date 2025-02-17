import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { RaiseQuestionTrigger } from './RaiseQuestionTrigger';

interface IProps {
  shouldShowDemoAgent: boolean;
  setShowDemoAgent: Dispatch<SetStateAction<boolean>>;
  onRaiseDemoQuery: (queryRaised: boolean) => void;
  onCloseDemoAgent: () => void;
  isDemoPlaying: boolean;
}

const AskQuestionContainer = ({
  shouldShowDemoAgent,
  setShowDemoAgent,
  onRaiseDemoQuery,
  onCloseDemoAgent,
  isDemoPlaying,
}: IProps) => {
  const showPopover = !isDemoPlaying && shouldShowDemoAgent;

  return (
    <Popover open={showPopover}>
      <PopoverTrigger asChild>
        <RaiseQuestionTrigger
          shouldShowDemoAgent={shouldShowDemoAgent}
          setShowDemoAgent={setShowDemoAgent}
          onRaiseDemoQuery={onRaiseDemoQuery}
        />
      </PopoverTrigger>
      <PopoverContent
        className="text-popover-foreground relative z-50 flex h-[580px] w-[440px] flex-1 flex-col overflow-hidden  rounded-lg border bg-primary-foreground/60 px-2 py-4 shadow-md outline-none backdrop-blur-lg"
        align="start"
        side="top"
        sideOffset={10}
        alignOffset={10}
      >
        <div className="ml-2 flex items-end justify-end  p-2">
          <div
            className="flex cursor-pointer
items-center rounded-lg border-2 border-[rgb(var(--primary))] border-opacity-60 p-3"
            onClick={onCloseDemoAgent}
          >
            <span className="text-primary">Close & Resume Demo</span>
            <X height={24} width={24} color="rgb(var(--primary)/ 0.6)" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { AskQuestionContainer };
