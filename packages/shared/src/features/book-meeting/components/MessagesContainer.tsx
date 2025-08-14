import { ViewType } from '../../../utils/enum';
import { useMessagesScrolling } from '../hooks/useMessagesScrolling';
import { willMessageRenderHTML } from '../../../utils/common';
import React from 'react';
import DownArrowButton from './DownArrowButton';
import MessageGroup from './MessageGroup';
import { Message, SendUserMessageParams } from '../../../types/message';

type MessagesContainerProps = {
  messages: Message[];
  enableScrollToBottom: boolean;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
};

const MessagesContainer = ({ messages, enableScrollToBottom, handleSendUserMessage }: MessagesContainerProps) => {
  // Use the custom scrolling hook
  const {
    parentContainerRef,
    lastGroupRef,
    groupStartScrollTargetRef,
    groupEndScrollTargetRef,
    agentMessagesContainerRef,
    containerHeight,
    showDownArrow,
    handleScrollToBottomOfContainer,
    lastGroupWithContentIndex,
    messagesSortedByResponseIdAndTimestamp,
  } = useMessagesScrolling({
    messages,
    viewType: ViewType.USER,
    enableScrollToBottom,
  });

  const aiMessages = messages.filter((message) => message.role === 'ai');

  return (
    <div
      ref={parentContainerRef}
      className="max-h-md h-fit w-full"
      onWheel={(e) => e.stopPropagation()}
      // style={containerStyle}
    >
      <div ref={agentMessagesContainerRef} className="relative h-full flex-1 p-4">
        <div className="mx-auto flex w-full flex-col gap-8">
          {/* Message Groups */}
          {messagesSortedByResponseIdAndTimestamp.map((group, groupIndex) => {
            const isLastGroupWithContent = groupIndex === lastGroupWithContentIndex;
            const hasRenderableItems = group.some((message) => willMessageRenderHTML(message));

            return (
              <React.Fragment key={groupIndex}>
                <MessageGroup
                  group={group}
                  groupIndex={groupIndex}
                  isLastGroupWithContent={isLastGroupWithContent}
                  containerHeight={containerHeight}
                  enableScrollToBottom={enableScrollToBottom}
                  aiMessages={aiMessages}
                  lastGroupRef={lastGroupRef}
                  groupStartScrollTargetRef={groupStartScrollTargetRef}
                  groupEndScrollTargetRef={groupEndScrollTargetRef}
                  messages={messages}
                  handleSendUserMessage={handleSendUserMessage}
                />

                {/* Down Arrow Button - positioned after the last group */}
                {isLastGroupWithContent && hasRenderableItems && (
                  <DownArrowButton show={showDownArrow} onClick={handleScrollToBottomOfContainer} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessagesContainer;
