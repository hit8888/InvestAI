import { cn } from '@breakout/design-system/lib/cn';
import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import TooltipWrapperDark from '../Tooltip/TooltipWrapperDark';
import { useScreenSize } from '@meaku/core/hooks/useScreenSize';
import BlackThreeStarIcon from '../icons/black-three-star-icon';
import Typography from '../Typography';
import { useTextTruncation } from '../../hooks/useTextTruncation';
import { ViewType } from '@meaku/core/types/common';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
  itemIndex: number;
  isQuestionInCycle?: boolean;
  isEntryPointQuestion: boolean;
  invertTextColor?: boolean;
  viewType?: ViewType;
}

const Suggestion = ({
  question,
  onSuggestedQuestionOnClick,
  itemIndex,
  isEntryPointQuestion,
  isQuestionInCycle = false,
  invertTextColor,
  viewType,
}: IProps) => {
  const { isTablet } = useScreenSize();
  const { textRef, isTextTruncated } = useTextTruncation({
    text: question,
    maxWidth: isQuestionInCycle ? 380 : undefined,
  });

  const isClickEnabled = !viewType || viewType === ViewType.USER;

  const handleClickOnSuggestedQuestion = (question: string) => {
    if (isClickEnabled) {
      onSuggestedQuestionOnClick(question);
    }
  };

  return (
    <div
      onClick={() => handleClickOnSuggestedQuestion(question)}
      className={cn(
        `flex w-fit cursor-pointer items-center justify-end gap-2 rounded-full py-1 transition-all duration-300 ease-in-out`,
        {
          'border border-gray-900 bg-white py-2 pl-2 pr-4 hover:bg-transparent_gray_6 focus:ring-4 focus:ring-gray-200':
            !isEntryPointQuestion,
          'border-2 border-primary/60 bg-primary/80 px-2 hover:bg-primary/90 focus:bg-primary': isEntryPointQuestion,
          'max-w-[380px]': isQuestionInCycle,
          'cursor-not-allowed hover:bg-transparent': !isClickEnabled,
        },
      )}
      data-testid={isEntryPointQuestion ? `entry-point-suggestion-item-${itemIndex}` : `suggestion-item-${itemIndex}`}
    >
      <div className="h-4 w-4">
        {!isEntryPointQuestion ? (
          <BlackThreeStarIcon width={14} height={14} className="transition-colors duration-300 ease-in-out" />
        ) : (
          <SparkleIcon
            color={invertTextColor ? 'black' : 'white'}
            className={cn('!h-4 !w-4 transition-colors duration-300 ease-in-out', {
              'group-hover:fill-white': !invertTextColor,
              'group-hover:fill-black': invertTextColor,
            })}
          />
        )}
      </div>
      <TooltipWrapperDark
        tooltipSide="top"
        tooltipAlign="end"
        tooltipSideOffsetValue={15}
        trigger={
          <Typography
            ref={textRef}
            variant="label-14-medium"
            align="left"
            textColor={isEntryPointQuestion ? (invertTextColor ? 'default' : 'white') : 'textSecondary'}
            className={cn('line-clamp-1 lg:line-clamp-2', {
              'min-w-0 max-w-[350px] flex-1': isQuestionInCycle,
              'cursor-not-allowed hover:bg-transparent': !isClickEnabled,
            })}
          >
            {question}
          </Typography>
        }
        showTooltip={isQuestionInCycle ? isTextTruncated : isTablet}
        content={<p className="max-w-[350px]">{question}</p>}
      />
    </div>
  );
};

export { Suggestion };
