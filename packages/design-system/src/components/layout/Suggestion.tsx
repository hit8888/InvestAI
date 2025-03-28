import { cn } from '@breakout/design-system/lib/cn';
import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import TooltipWrapperDark from '../Tooltip/TooltipWrapperDark';
import { useScreenSize } from '../../hooks/useScreenSize';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
  itemIndex: number;
  isQuestionInCycle?: boolean;
}

const Suggestion = ({ question, onSuggestedQuestionOnClick, itemIndex, isQuestionInCycle = false }: IProps) => {
  const { isTablet } = useScreenSize();

  const handleClickOnSuggestedQuestion = (question: string) => {
    onSuggestedQuestionOnClick(question);
  };

  return (
    <div
      onClick={() => handleClickOnSuggestedQuestion(question)}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 text-wrap rounded-full border-2 border-primary/60 bg-primary/80 px-2 py-1 transition-all duration-300 ease-in-out hover:bg-primary/90 focus:bg-primary',
        {
          'max-w-[300px]': isQuestionInCycle,
        },
      )}
      data-testid={`suggestion-item-${itemIndex}`}
    >
      <div className="!h-4 !w-4">
        <SparkleIcon
          color="white"
          className="!h-4 !w-4 transition-colors duration-300 ease-in-out group-hover:fill-white"
        />
      </div>
      <TooltipWrapperDark
        tooltipSide="top"
        tooltipAlign="end"
        tooltipSideOffsetValue={30}
        trigger={
          <p className="line-clamp-1 w-full text-left text-sm font-medium text-white lg:line-clamp-2">{question}</p>
        }
        showTooltip={isQuestionInCycle ? false : isTablet}
        content={<p>{question}</p>}
      />
    </div>
  );
};

export { Suggestion };
