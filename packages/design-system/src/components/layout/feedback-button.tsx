import { cn } from '../../lib/cn';
import ThumbIcon from '../icons/thumb';
import Button, { ButtonProps } from '../Button';
import React from 'react';

interface IProps extends ButtonProps {
  isFilled?: boolean;
  isInverted?: boolean;
}

const FeedbackButton = React.forwardRef((props: IProps) => {
  const { isFilled, isInverted, ...restProps } = props;

  return (
    <Button
      buttonStyle="icon"
      variant="secondary"
      className={cn('h-auto w-auto rounded-lg border p-[6px]', {
        'bg-primary-foreground': isFilled,
        'bg-primary-foreground/10': !isFilled,
        'rotate-180 transform': isInverted,
      })}
      {...restProps}
    >
      <ThumbIcon className="!h-6 !w-6 text-primary" isFilled={isFilled} />
    </Button>
  );
});

export default FeedbackButton;
