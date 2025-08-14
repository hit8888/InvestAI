import { MessageGroupProps } from '../../../utils/types';
import { willMessageRenderHTML } from '../../../utils/common';
import ScrollTarget from './ScrollTarget';
import MessageItem from './MessageItem';
import { ViewType } from '../../../utils/enum';
import { Message } from '../../../types/message';

export const calculateMinHeight = (
  isLastGroupWithContent: boolean,
  aiMessages: Message[],
  hasFirstUserMessageBeenSent: boolean | undefined,
  containerHeight: number,
): string | undefined => {
  if (!isLastGroupWithContent) return undefined;

  if (aiMessages.length > 1 || hasFirstUserMessageBeenSent) {
    return `${containerHeight}px`;
  }

  return undefined;
};

const MessageGroup = ({
  group,
  isLastGroupWithContent,
  containerHeight,
  enableScrollToBottom,
  aiMessages,
  hasFirstUserMessageBeenSent,
  lastGroupRef,
  groupStartScrollTargetRef,
  groupEndScrollTargetRef,
  messages,
  handleSendUserMessage,
}: MessageGroupProps) => {
  // Check if there's at least one item in the group that will render HTML
  const hasRenderableItems = group.some((message) => willMessageRenderHTML(message));

  if (!hasRenderableItems) {
    return null;
  }

  const minHeight = calculateMinHeight(
    isLastGroupWithContent,
    aiMessages,
    hasFirstUserMessageBeenSent,
    containerHeight,
  );

  const shouldApplyMinHeight = hasRenderableItems && containerHeight > 0 && enableScrollToBottom;

  return (
    <div
      className="flex flex-col gap-8"
      style={shouldApplyMinHeight ? { minHeight } : undefined}
      ref={isLastGroupWithContent ? lastGroupRef : null}
    >
      {/* Start scroll target */}
      {isLastGroupWithContent && enableScrollToBottom && (
        <ScrollTarget refProp={groupStartScrollTargetRef} position="start" keyPrefix="last-group" />
      )}

      {/* Messages */}
      {group.map((message, idx) => (
        <MessageItem
          key={idx}
          viewType={ViewType.USER}
          message={message}
          messages={messages}
          handleSendUserMessage={handleSendUserMessage}
        />
      ))}

      {/* End scroll target */}
      {isLastGroupWithContent && hasRenderableItems && enableScrollToBottom && (
        <ScrollTarget refProp={groupEndScrollTargetRef} position="end" keyPrefix="last-group" />
      )}
    </div>
  );
};

export default MessageGroup;
