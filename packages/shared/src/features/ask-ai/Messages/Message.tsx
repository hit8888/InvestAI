import { cn, typographyVariants, type AvatarComponentProps } from '@meaku/saral';
import { MessageAvatar } from '../../../components/AvatarDisplay';
import type {
  ArtifactEventData,
  Message as MessageType,
  VideoArtifactData,
  SlideImageArtifactData,
} from '../../../types/message';
import { TextArtifact } from './TextArtifact';
import { ImageArtifact } from './ImageArtifact';
import { VideoArtifact } from './VideoArtifact';
import FormArtifact from '../../../components/FormArtifact';
import { QualificationFormArtifact } from '../../../components/QualificationFormArtifact';
import { CalendarArtifact } from '../../../components/calendar';
import { DiscoveryQuestion } from './DiscoveryQuestion';
import CtaEventMessage from '../../book-meeting/components/CtaEventMessage';
import { ConversationEvent } from './ConversationEvent';
import { FormArtifactContent, FormArtifactMetadataType, CalendarArtifactContent } from '../../../utils/artifact';
import { SendUserMessageParams } from '../../../types/message';
import { useMessageProcessor } from '../hooks/useMessageProcessor';
import MessageTail from './components/MessageTail';
import { isJoinSessionEvent, isLeaveSessionEvent } from '../../../utils/message-utils';

interface MessageProps {
  message: MessageType;
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
  getFilledData: (responseId: string) => Record<string, string> | undefined;
  getQualificationFilledData: (responseId: string) => Array<{ id: string; answer: string }>;
  filledCalendarUrls?: string[];
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;
  adminSessionInfo?: {
    name: string;
    profilePicture?: string | null;
  } | null;
  isWithinAdminSession?: boolean;
  isLatestMessage?: boolean;
  isExpanded?: boolean;
  shouldShowSessionIndicator?: boolean;
  onExpand?: () => void;
  showLogo?: boolean;
  logoUrl?: string | null;
}

export const Message = ({
  message,
  sendUserMessage,
  getFilledData,
  getQualificationFilledData,
  filledCalendarUrls = [],
  selectedAvatar,
  adminSessionInfo,
  isWithinAdminSession = false,
  isLatestMessage = false,
  isExpanded = false,
  shouldShowSessionIndicator = false,
  onExpand,
  showLogo,
  logoUrl,
}: MessageProps) => {
  const { eventType, eventData, isTextArtifact, isAdminResponse, isVideoArtifact, isImageArtifact, isCtaEvent } =
    useMessageProcessor(message);
  // Note: ADMIN_TYPING events are now handled globally in the store and shown in the header
  // const isTypingEvent = eventType === 'ADMIN_TYPING';

  // Extract text content for different message types
  let textContent = '';

  if (isTextArtifact) {
    textContent = (eventData as { content: string })?.content as string;
  } else if (isAdminResponse) {
    // For admin response, get content from the nested message structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'ADMIN_RESPONSE') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      textContent = (message as any).message?.content as string;
    } else if (eventType === 'ADMIN_RESPONSE') {
      // Fallback for flat structure
      textContent = (eventData as { content: string })?.content as string;
    }
  }

  const videoArtifactData = isVideoArtifact
    ? ((eventData as unknown as ArtifactEventData).artifact_data as VideoArtifactData)
    : null;

  const imageArtifactData = isImageArtifact
    ? ((eventData as unknown as ArtifactEventData).artifact_data as SlideImageArtifactData)
    : null;

  const isFormArtifact = eventType === 'FORM_ARTIFACT';
  const isCalendarArtifact = eventType === 'CALENDAR_ARTIFACT';
  const isDiscoveryQuestion = eventType === 'DISCOVERY_QUESTIONS';
  const isSuggestionsArtifact = eventType === 'SUGGESTIONS_ARTIFACT';
  const isQualificationFormArtifact = eventType === 'QUALIFICATION_FORM_ARTIFACT';
  // Extract form artifact data
  const formArtifactData = isFormArtifact
    ? ((eventData as unknown as ArtifactEventData).artifact_data as {
        artifact_id: string;
        content: FormArtifactContent;
        metadata: FormArtifactMetadataType;
      })
    : null;

  // Extract qualification form artifact data
  const qualificationFormArtifactData = isQualificationFormArtifact
    ? ((message.event_data as ArtifactEventData).artifact_data as {
        artifact_id: string;
        content: FormArtifactContent;
        metadata: FormArtifactMetadataType;
      })
    : null;

  // Extract calendar artifact data
  const calendarArtifactData = isCalendarArtifact
    ? ((eventData as unknown as ArtifactEventData).artifact_data as {
        artifact_id: string;
        content: CalendarArtifactContent;
        metadata: Record<string, unknown>;
      })
    : null;

  const qualificationQuestionsAnswered = qualificationFormArtifactData
    ? getQualificationFilledData(message.response_id).length > 0
    : false;

  // Check if calendar artifact has been submitted by comparing URLs
  const isCalendarSubmitted = calendarArtifactData
    ? filledCalendarUrls.includes(calendarArtifactData.content.calendar_url)
    : false;

  // Extract discovery question data
  const discoveryQuestionData = isDiscoveryQuestion
    ? (eventData as {
        answer_type: string;
        question: string;
        response_options: Array<{ type: string; value: string; placeholder?: string }>;
        is_required: boolean;
        content: string;
      })
    : null;

  // Create a wrapper function to match the expected signature
  const handleSendUserMessage = (data: SendUserMessageParams) => {
    if (sendUserMessage) {
      sendUserMessage(data.message, data.overrides);
    }
  };

  // Check if this is a conversation event (JOIN_SESSION or LEAVE_SESSION)
  const isJoinSessionEventPresent = isJoinSessionEvent(message);
  const isLeaveSessionEventPresent = isLeaveSessionEvent(message);

  const isConversationEvent = isJoinSessionEventPresent || isLeaveSessionEventPresent;

  const isFormFilled =
    (isFormArtifact && formArtifactData && formArtifactData.metadata.is_filled) || !!getFilledData(message.response_id);

  const containerClassName = cn({
    'pr-3 flex py-2 rounded-xl relative text-foreground font-normal text-sm leading-[22px] animate-in fade-in slide-in-from-bottom-2 duration-800':
      true,
    'mr-auto max-w-full pl-10': message.role === 'ai' || isAdminResponse,
    hidden: isTextArtifact && !textContent?.length,
    'ml-auto bg-card pl-3 w-fit max-w-[80%]': message.role === 'user',
    [typographyVariants({ variant: 'body', fontWeight: 'normal' })]: true,
    '!max-w-full w-full':
      isVideoArtifact ||
      isImageArtifact ||
      isFormArtifact ||
      isQualificationFormArtifact ||
      isCalendarArtifact ||
      isDiscoveryQuestion ||
      isSuggestionsArtifact ||
      isCtaEvent,
    'py-0 pr-4 pl-10': isDiscoveryQuestion || isFormArtifact,
    'py-0 px-4 justify-center': isQualificationFormArtifact,
    'p-0 mt-4': isCalendarArtifact || isCtaEvent || (isFormArtifact && isFormFilled),
  });

  if (
    !isTextArtifact &&
    !isAdminResponse &&
    !videoArtifactData &&
    !imageArtifactData &&
    !isFormArtifact &&
    !isQualificationFormArtifact &&
    !isCalendarArtifact &&
    !isDiscoveryQuestion &&
    !isCtaEvent &&
    !isConversationEvent
  ) {
    return null;
  }

  return (
    <div className={containerClassName} data-message-id={message.response_id}>
      <MessageAvatar
        shouldShow={
          (message.role === 'ai' || isAdminResponse) &&
          !isFormArtifact &&
          !isQualificationFormArtifact &&
          !isCalendarArtifact &&
          !isDiscoveryQuestion &&
          !isVideoArtifact &&
          !isImageArtifact &&
          !isSuggestionsArtifact &&
          !isCtaEvent
        }
        adminSessionInfo={isWithinAdminSession ? adminSessionInfo : undefined}
        selectedAvatar={selectedAvatar}
        showOnlineIndicator={isAdminResponse && (isJoinSessionEventPresent || shouldShowSessionIndicator)}
        showLogo={showLogo}
        logoUrl={logoUrl}
        logoSize={24}
        wrapperClassName="absolute top-2 left-0"
      />
      {(isTextArtifact || isAdminResponse) && (
        <div
          className={cn('w-full whitespace-normal break-words', {
            'text-start': message.role === 'user',
          })}
        >
          <TextArtifact content={textContent} />
        </div>
      )}
      {videoArtifactData && (
        <VideoArtifact
          title={videoArtifactData.content.title}
          url={videoArtifactData.content.video_url}
          isLatestMessage={isLatestMessage}
          isExpanded={isExpanded}
        />
      )}
      {imageArtifactData && (
        <ImageArtifact
          title={imageArtifactData.content.title}
          url={imageArtifactData.content.image_url}
          isLatestMessage={isLatestMessage}
          isExpanded={isExpanded}
        />
      )}
      {isFormArtifact && formArtifactData && sendUserMessage && (
        <FormArtifact
          artifactId={formArtifactData.artifact_id}
          artifact={formArtifactData.content}
          artifactMetadata={formArtifactData.metadata}
          handleSendUserMessage={handleSendUserMessage}
          isFilled={isFormFilled}
          filledData={getFilledData(message.response_id)}
          artifactResponseId={message.response_id}
        />
      )}
      {isQualificationFormArtifact && qualificationFormArtifactData && sendUserMessage && (
        <QualificationFormArtifact
          artifactId={qualificationFormArtifactData.artifact_id}
          content={qualificationFormArtifactData.content}
          handleSendUserMessage={handleSendUserMessage}
          isFilled={qualificationQuestionsAnswered}
          filledData={getQualificationFilledData(message.response_id)}
          responseId={message.response_id}
        />
      )}
      {isCalendarArtifact && calendarArtifactData && sendUserMessage && (
        <CalendarArtifact
          content={{
            ...calendarArtifactData.content,
            artifact_id: calendarArtifactData.artifact_id,
          }}
          metadata={calendarArtifactData.metadata}
          handleSendUserMessage={handleSendUserMessage}
          isSubmitted={isCalendarSubmitted}
          artifactResponseId={message.response_id}
          onExpand={onExpand!}
        />
      )}

      {isDiscoveryQuestion && discoveryQuestionData && sendUserMessage && (
        <DiscoveryQuestion
          question={discoveryQuestionData.question}
          isRequired={discoveryQuestionData.is_required}
          handleSendUserMessage={handleSendUserMessage}
          responseId={message.response_id}
        />
      )}
      {isCtaEvent && sendUserMessage && (
        <CtaEventMessage showIcon={false} event={message} handleSendUserMessage={handleSendUserMessage} />
      )}
      {isConversationEvent && (
        <ConversationEvent message={message} shouldShowSessionIndicator={shouldShowSessionIndicator} />
      )}
      <MessageTail role={message.role} />
    </div>
  );
};
