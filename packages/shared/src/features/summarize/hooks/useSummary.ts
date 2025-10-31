import { useEffect, useMemo, useState } from 'react';
import { useCommandBarStore } from '../../../stores';
import { useWsClient } from '../../../hooks/useWsClient';
import { MessageEventType, type Message, type StreamResponseEventData } from '../../../types/message';
import { ensureProtocol } from '@meaku/core/utils/index';

// TODO: Need proper error types for summary stream messages from the backend
const ERROR_MESSAGES = [
  "I'm sorry, an error occurred while generating the summary.",
  "I'm sorry, I couldn't fetch content from the provided URL. Please try again later.",
];

const isSummaryStreamMessage = (
  message: Message,
): message is Extract<Message, { event_type: typeof MessageEventType.SUMMARY_STREAM }> =>
  message.event_type === MessageEventType.SUMMARY_STREAM;

export const useSummary = () => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [clickedOnSummarize, setClickedOnSummarize] = useState(false);
  const { messages, settings } = useCommandBarStore();
  const { sendUserMessage } = useWsClient();

  const summaryContent = useMemo(() => {
    const summarizeMessageResponseId = messages.find(
      (message) => message.event_type === MessageEventType.SUMMARIZE && message.event_data?.url === settings.parent_url,
    )?.response_id;

    const summaryMessages = messages.filter(
      (message) => message.response_id === summarizeMessageResponseId && isSummaryStreamMessage(message),
    );
    const summaryMessage = summaryMessages[summaryMessages.length - 1];

    const summaryContent = (summaryMessage?.event_data as StreamResponseEventData | undefined)?.content;

    return summaryContent;
  }, [messages, settings.parent_url]);

  const handleSummarize = () => {
    setIsSummarizing(true);
    setClickedOnSummarize(true);
    sendUserMessage('', {
      event_type: MessageEventType.SUMMARIZE,
      event_data: {
        content: '',
        url: ensureProtocol(settings.parent_url ?? ''),
      },
    });
  };

  useEffect(() => {
    if (summaryContent) {
      setIsSummarizing(false);
    }
  }, [summaryContent]);

  return {
    summaryContent,
    isSummarizing,
    clickedOnSummarize,
    handleSummarize,
    hasError: ERROR_MESSAGES.some((errorMessage) => summaryContent?.toLowerCase().includes(errorMessage.toLowerCase())),
  };
};
