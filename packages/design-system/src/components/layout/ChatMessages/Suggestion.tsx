import { cn } from '@breakout/design-system/lib/cn';
import AccessibleDiv from '../../accessibility/AccessibleDiv';
import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import TooltipWrapperDark from '../../Tooltip/TooltipWrapperDark';
import BlackThreeStarIcon from '../../icons/black-three-star-icon';
import Typography from '../../Typography';
import { useTextTruncation } from '../../../hooks/useTextTruncation';
import { ViewType } from '@neuraltrade/core/types/common';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
  itemIndex: number;
  isQuestionInCycle?: boolean;
  isEntryPointQuestion: boolean;
  invertTextColor?: boolean;
  viewType?: ViewType;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

const Suggestion = ({
  question,
  onSuggestedQuestionOnClick,
  itemIndex,
  isEntryPointQuestion,
  isQuestionInCycle = false,
  invertTextColor,
  viewType,
  tooltipSide = 'top',
}: IProps) => {
  const isMobile = useIsMobile();
  const { textRef, isTextTruncated } = useTextTruncation({
    text: question,
    maxWidth: isQuestionInCycle ? (isMobile ? 250 : 380) : undefined,
  });

  const isClickEnabled = !viewType || viewType === ViewType.USER;

  const handleClickOnSuggestedQuestion = (question: string) => {
    if (isClickEnabled) {
      onSuggestedQuestionOnClick(question);
    }
  };

  return (
    <AccessibleDiv
      onClick={() => handleClickOnSuggestedQuestion(question)}
      disabled={!isClickEnabled}
      className={cn(
        `flex w-fit cursor-pointer items-center justify-end gap-2 rounded-full py-1 transition-all duration-300 ease-in-out`,
        {
          'border border-gray-900 bg-white py-2 pl-2 pr-4 hover:bg-transparent_gray_6 focus:ring-4 focus:ring-gray-200':
            !isEntryPointQuestion,
          'border-2 border-primary/60 bg-primary/80 px-2 hover:bg-primary/90 focus:bg-primary': isEntryPointQuestion,
          'max-w-[380px]': !isMobile && isQuestionInCycle,
          'max-w-[250px]': isMobile && isQuestionInCycle,
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
        tooltipSide={tooltipSide}
        tooltipAlign="end"
        tooltipSideOffsetValue={15}
        trigger={
          <Typography
            ref={textRef}
            variant="label-14-medium"
            align="left"
            textColor={isEntryPointQuestion ? (invertTextColor ? 'default' : 'white') : 'textSecondary'}
            className={cn({
              'line-clamp-1 min-w-0 max-w-[350px]': !isMobile && isQuestionInCycle,
              'cursor-not-allowed hover:bg-transparent': !isClickEnabled,
              'line-clamp-1 lg:line-clamp-2': isMobile && !isQuestionInCycle,
              'line-clamp-2 min-w-0 max-w-[250px]': isMobile && isQuestionInCycle,
            })}
          >
            {question}
          </Typography>
        }
        showTooltip={isTextTruncated}
        content={<p className={cn('max-w-[350px]', { 'max-w-[250px]': isMobile })}>{question}</p>}
      />
    </AccessibleDiv>
  );
};

export { Suggestion };
