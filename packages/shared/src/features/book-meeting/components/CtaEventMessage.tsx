import { CtaEventDataContent } from '../../../utils/types';
import { Typography, Button } from '@meaku/saral';
import { ArrowRight } from 'lucide-react';
import { Icons } from '@meaku/saral';
import { Message, SendUserMessageParams } from '../../../types/message';

type IProps = {
  event: Message;
  showPreview?: boolean;
  handleSendUserMessage?: (data: SendUserMessageParams) => void;
};

const DEFAULT_MESSAGES: { MESSAGE: string; LABEL: string; TITLE?: string } = {
  TITLE: 'Thanks for telling us about your business!',
  MESSAGE: "You're just a step away from exploring everything we offer.",
  LABEL: 'Start Trial',
};

const CtaEventMessage = (props: IProps) => {
  const { event, handleSendUserMessage } = props;
  const { label, message, url, align, title } = (event.event_data as CtaEventDataContent) ?? {};

  const handleClick = () => {
    if (!url) return;

    handleSendUserMessage?.({
      message: '',
      overrides: {
        event_data: { url },
        event_type: 'BOOK_MEETING',
      },
    });
    window.open(url, '_blank');
  };

  if (!align) {
    return null;
  }

  return (
    <div className="relative flex flex-col items-start gap-4">
      <div className="absolute -bottom-2 -left-3 -right-3 top-0 z-10 bg-gradient-to-b from-black/10 to-black/15" />
      <div className="relative z-10 z-20 mb-2 mt-3 flex w-full flex-col rounded-xl bg-background">
        <div className="bg-positive-dark flex w-full items-start justify-start gap-2 rounded-xl p-3">
          <div className="flex items-center justify-center rounded-full bg-white/20 p-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-1">
              <Icons.Check className="text-positive-dark h-6 w-6" />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="heading" className="text-white">
              {title || DEFAULT_MESSAGES.TITLE}
            </Typography>
            <Typography variant="body-small" className="text-white/70">
              {message ?? DEFAULT_MESSAGES.MESSAGE}
            </Typography>
          </div>
        </div>
        {url && (
          <Button onClick={handleClick} className="m-2">
            {label ?? DEFAULT_MESSAGES.LABEL}
            <ArrowRight width="16" height="16" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CtaEventMessage;
