import { CtaEventDataContent, EventMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import Typography from '../Typography';
import { cn } from '@breakout/design-system/lib/cn';
import Button from '@breakout/design-system/components/Button/index';
import ArrowRight from '../icons/ArrowRight';

interface IProps {
  event?: WebSocketMessage;
}

const DEFAULT_MESSAGE = 'You’re just a step away from exploring everything we offer.';
const DEFAULT_LABEL = 'Start Trial';

const CtaEventMessage = (props: IProps) => {
  const { event } = props;
  const { event_data } = (event?.message as EventMessageContent) ?? {};
  const { label, message, url, align } = (event_data as CtaEventDataContent) ?? {};

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (align !== 'left') {
    return null;
  }

  return (
    <div className={cn('my-4 pl-11 pr-6')}>
      <div className="flex w-full max-w-[424px] items-center justify-between gap-4 rounded-2xl bg-transparent_gray_3 p-4">
        <Typography className="w-7/12" variant="title-18">
          {message ?? DEFAULT_MESSAGE}
        </Typography>
        <Button onClick={handleClick}>
          {label ?? DEFAULT_LABEL}
          <ArrowRight width="16" height="16" />
        </Button>
      </div>
    </div>
  );
};

export default CtaEventMessage;
