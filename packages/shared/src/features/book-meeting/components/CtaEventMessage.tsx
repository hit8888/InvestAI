import Lottie from 'lottie-react';

import { CtaEventDataContent } from '../../../utils/types';
import { Typography, Button, LucideIcon } from '@meaku/saral';
import { Message, SendUserMessageParams } from '../../../types/message';
import { useEffect, useCallback, useMemo } from 'react';
import { getLocalStorageData, setLocalStorageData } from '@meaku/core/utils/storage-utils';
import loadingDotsBlueAnimation from '../../../assets/loading-dots-blue.json';

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

const AUTO_REDIRECT_DELAY_MS = 2000;

const CtaEventMessage = (props: IProps) => {
  const { event, handleSendUserMessage, showIcon } = props;
  const { label, message, url, align, title, auto_redirect } = (event.event_data as CtaEventDataContent) ?? {};

  const alreadyAutoRedirected = useMemo(() => {
    const redirectKey = `primary_goal_redirected_${event.response_id}`;
    const storageData = getLocalStorageData();
    return storageData?.[redirectKey as keyof typeof storageData] ?? false;
  }, [event.response_id]);

  const shouldAutoRedirect = !alreadyAutoRedirected && (auto_redirect ?? false) && url;

  const handleClick = useCallback(() => {
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
  }, [url, handleSendUserMessage, event.response_id]);

  useEffect(() => {
    if (!shouldAutoRedirect) return;

    const timer = setTimeout(() => {
      handleClick();
      setLocalStorageData({ [`primary_goal_redirected_${event.response_id}`]: true });
    }, AUTO_REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoRedirect]);

  if (!align) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        {showIcon &&
          (shouldAutoRedirect ? (
            <div className="w-32 h-16 overflow-hidden relative">
              <Lottie
                animationData={loadingDotsBlueAnimation}
                loop={true}
                autoplay={true}
                className="absolute left-1/2 top-1/2 h-[192px] w-[192px] -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full border-[16px] border-green-100 bg-green-500 p-2">
              <LucideIcon name="check" className="stroke-4 size-5 text-background" />
            </div>
          ))}
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
