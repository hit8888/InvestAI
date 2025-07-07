import { CtaEventDataContent, EventMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import Typography from '../../Typography';
import Button from '@breakout/design-system/components/Button/index';
import ArrowRight from '../../icons/ArrowRight';
import MessageItemLayout, { Padding } from './MessageItemLayout';

type IProps = {
  event: WebSocketMessage;
  showPreview?: boolean;
  handleSendUserMessage?: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
};
type SupportedCtaAlign = 'left' | 'right';

const DEFAULT_MESSAGES: Record<SupportedCtaAlign, { MESSAGE: string; LABEL: string; TITLE?: string }> = {
  left: {
    MESSAGE: 'You’re just a step away from exploring everything we offer.',
    LABEL: 'Start Trial',
  },
  right: {
    TITLE: 'Thanks for telling us about your business!',
    MESSAGE: 'You can create your account and get started',
    LABEL: 'Sign Up',
  },
};

const CtaEventMessage = (props: IProps) => {
  const { event, handleSendUserMessage } = props;
  const { event_data } = (event?.message as EventMessageContent) ?? {};
  const { label, message, url, align, title } = (event_data as CtaEventDataContent) ?? {};

  const handleClick = () => {
    if (!url) return;

    handleSendUserMessage?.({
      message: {
        content: '',
        event_type: 'PRIMARY_GOAL_CTA_CLICKED',
        event_data: { url },
      },
      message_type: 'EVENT',
    });
    window.open(url, '_blank');
  };

  if (!align || !DEFAULT_MESSAGES[align as SupportedCtaAlign]) {
    return null;
  }

  if (align === 'left') {
    return (
      <MessageItemLayout paddingInline={Padding.INLINE}>
        <div className="flex w-full max-w-[424px] items-center justify-between gap-4 rounded-2xl bg-transparent_gray_3 p-4">
          <Typography className="w-7/12" variant="title-18">
            {message ?? DEFAULT_MESSAGES[align].MESSAGE}
          </Typography>
          <Button onClick={handleClick}>
            {label ?? DEFAULT_MESSAGES[align].LABEL}
            <ArrowRight width="16" height="16" />
          </Button>
        </div>
      </MessageItemLayout>
    );
  }

  if (align === 'right') {
    return (
      <div className="w-[66%] pl-2 pr-4 pt-4">
        <div className="flex h-full max-h-full w-full items-center justify-center rounded-[10px] border border-gray-200 bg-transparent_gray_3 p-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <Typography variant="title-24" className="text-center">
              {title || DEFAULT_MESSAGES[align].TITLE}
            </Typography>
            {url && (
              <div className="flex flex-col items-center justify-center gap-6">
                <Typography variant="body-16" textColor="textPrimary" className="text-center">
                  {message || DEFAULT_MESSAGES[align].MESSAGE}
                </Typography>
                <Button variant="system" onClick={handleClick}>
                  {label || DEFAULT_MESSAGES[align].LABEL}
                  <ArrowRight width="16" height="16" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default CtaEventMessage;
