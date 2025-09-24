import { CtaEventDataContent } from '../../../utils/types';
import { Typography, Button, LucideIcon } from '@meaku/saral';
import { Message, SendUserMessageParams } from '../../../types/message';

type IProps = {
  event: Message;
  showIcon: boolean;
  handleSendUserMessage?: (data: SendUserMessageParams) => void;
};

const DEFAULT_MESSAGES: { MESSAGE: string; LABEL: string; TITLE?: string } = {
  TITLE: 'Details Submitted',
  MESSAGE: "You're just a step away from exploring everything we offer.",
  LABEL: 'Start Trial',
};

const CtaEventMessage = (props: IProps) => {
  const { event, handleSendUserMessage, showIcon } = props;
  const { label, message, url, align, title } = (event.event_data as CtaEventDataContent) ?? {};

  const handleClick = () => {
    if (!url) return;

    handleSendUserMessage?.({
      message: '',
      overrides: {
        event_data: { url },
        event_type: 'PRIMARY_GOAL_CTA_CLICKED',
        response_id: event.response_id,
      },
    });
    window.open(url, '_blank');
  };

  if (!align) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        {showIcon && (
          <div className="flex items-center justify-center rounded-full border-[16px] border-green-100 bg-green-500 p-2">
            <LucideIcon name="check" className="stroke-4 size-5 text-background" />
          </div>
        )}
        <Typography variant="heading-xl" className="text-center font-medium">
          {title || DEFAULT_MESSAGES.TITLE}
        </Typography>
        <Typography variant="body-small">{message ?? DEFAULT_MESSAGES.MESSAGE}</Typography>
        {url && (
          <Button hasWipers onClick={handleClick}>
            {label ?? DEFAULT_MESSAGES.LABEL}
            <LucideIcon name="arrow-right" width="16" height="16" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CtaEventMessage;
