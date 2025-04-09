import { cn } from '@breakout/design-system/lib/cn';
import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import TooltipWrapperDark from '../Tooltip/TooltipWrapperDark';
import { useScreenSize } from '../../hooks/useScreenSize';
import BlackThreeStarIcon from '../icons/black-three-star-icon';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
  itemIndex: number;
  isQuestionInCycle?: boolean;
  isEntryPointQuestion: boolean;
}

const Suggestion = ({
  question,
  onSuggestedQuestionOnClick,
  itemIndex,
  isQuestionInCycle = false,
  isEntryPointQuestion,
}: IProps) => {
  const { isTablet } = useScreenSize();

  const handleClickOnSuggestedQuestion = (question: string) => {
    onSuggestedQuestionOnClick(question);
  };

  return (
    <div
      onClick={() => handleClickOnSuggestedQuestion(question)}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 text-wrap rounded-full py-1 transition-all duration-300 ease-in-out',
        {
          'border border-gray-900 bg-white pl-2 pr-3 hover:bg-transparent_gray_6 focus:ring-4 focus:ring-gray-200':
            !isEntryPointQuestion,
          'border-2 border-primary/60 bg-primary/80 px-2 hover:bg-primary/90 focus:bg-primary': isEntryPointQuestion,
          'max-w-[300px]': isQuestionInCycle,
        },
      )}
      data-testid={`suggestion-item-${itemIndex}`}
    >
      <div className="!h-4 !w-4">
        {!isEntryPointQuestion ? (
          <BlackThreeStarIcon width={12} height={13} className="transition-colors duration-300 ease-in-out" />
        ) : (
          <SparkleIcon
            color="white"
            className="!h-4 !w-4 transition-colors duration-300 ease-in-out group-hover:fill-white"
          />
        )}
      </div>
      <TooltipWrapperDark
        tooltipSide="top"
        tooltipAlign="end"
        tooltipSideOffsetValue={30}
        trigger={
          <p
            className={cn('line-clamp-1 w-full text-left text-sm font-medium lg:line-clamp-2', {
              'text-white': isEntryPointQuestion,
              'text-customSecondaryText': !isEntryPointQuestion,
            })}
          >
            {question}
          </p>
        }
        showTooltip={isQuestionInCycle ? false : isTablet}
        content={<p>{question}</p>}
      />
    </div>
  );
};

export { Suggestion };
