import { useEffect, useRef } from 'react';
import { useUrlParams } from './useUrlParams';
import { WebSocketMessage } from '../types/webSocketData';

type UseSendMessageOnQueryParamsProps = {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
};

const useSendMessageOnQueryParams = ({ handleSendMessage }: UseSendMessageOnQueryParamsProps) => {
  const { getParam, removeParam } = useUrlParams();
  const isFirstMessageSent = useRef(false);

  // "query" params is the message that is sent to the agent when the page is loaded
  const queryParamInitialMessage = getParam('query');

  useEffect(() => {
    if (queryParamInitialMessage && !isFirstMessageSent.current) {
      isFirstMessageSent.current = true;
      setTimeout(() => {
        handleSendMessage({
          message: {
            content: queryParamInitialMessage,
          },
          message_type: 'TEXT',
        });
        removeParam('query');
      });
    }
  }, [queryParamInitialMessage]);
};

export default useSendMessageOnQueryParams;
