import { cn, KatyIcon, typographyVariants, type AvatarComponentProps, ImageWithFallback } from '@meaku/saral';
import type {
  ArtifactEventData,
  Message as MessageType,
  VideoArtifactData,
  SlideImageArtifactData,
} from '../../../types/message';
import { TextArtifact } from './TextArtifact';
import { ImageArtifact } from './ImageArtifact';
import { VideoArtifact } from './VideoArtifact';
import { FormArtifact } from './FormArtifact';
import { QualificationFormArtifact } from './QualificationFormArtifact';
import { AskAiCalendarArtifact } from './AskAiCalendarArtifact';
import { DiscoveryQuestion } from './DiscoveryQuestion';
import CtaEventMessage from '../../book-meeting/components/CtaEventMessage';
import { ConversationEvent } from './ConversationEvent';
import { FormArtifactContent, FormArtifactMetadataType, CalendarArtifactContent } from '../../../utils/artifact';
import { SendUserMessageParams } from '../../../types/message';
import { useMessageProcessor } from '../hooks/useMessageProcessor';

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

  const containerClassName = cn({
    'pr-3 flex py-2 rounded-xl relative text-foreground font-normal text-sm leading-[22px] animate-in fade-in slide-in-from-bottom-2 duration-800':
      true,
    'mr-auto max-w-full pl-10': message.role === 'ai' || isAdminResponse,
    'ml-auto max-w-[70%] bg-card  pl-3': message.role === 'user',
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
    'py-0 pr-0 pl-10': isFormArtifact || isDiscoveryQuestion,
    'p-0': isCalendarArtifact || isCtaEvent,
  });

  const svgClassName = cn({
    'absolute bottom-0': true,
    'fill-card -right-[5px]': message.role === 'user',
  });

  // Check if this is a conversation event (JOIN_SESSION or LEAVE_SESSION)
  const isJoinSessionEvent =
    eventType === 'JOIN_SESSION' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'JOIN_SESSION');

  const isLeaveSessionEvent =
    eventType === 'LEAVE_SESSION' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'LEAVE_SESSION');

  const isConversationEvent = isJoinSessionEvent || isLeaveSessionEvent;

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
      {(message.role === 'ai' || isAdminResponse) &&
        !isFormArtifact &&
        !isQualificationFormArtifact &&
        !isCalendarArtifact &&
        !isDiscoveryQuestion &&
        !isVideoArtifact &&
        !isImageArtifact &&
        !isSuggestionsArtifact &&
        !isCtaEvent &&
        (isWithinAdminSession && adminSessionInfo?.profilePicture ? (
          <div className="absolute left-0 top-2">
            <ImageWithFallback
              src={adminSessionInfo.profilePicture}
              alt={adminSessionInfo.name}
              size={28}
              showOnlineIndicator={true}
            />
          </div>
        ) : selectedAvatar ? (
          <selectedAvatar.Component className="absolute left-0 top-2 size-7" />
        ) : (
          <KatyIcon className="absolute left-0 top-2 size-7" />
        ))}
      {(isTextArtifact || isAdminResponse) && (
        <div className="w-full">
          <TextArtifact content={textContent} />
        </div>
      )}
      {videoArtifactData && (
        <VideoArtifact title={videoArtifactData.content.title} url={videoArtifactData.content.video_url} />
      )}
      {imageArtifactData && (
        <ImageArtifact title={imageArtifactData.content.title} url={imageArtifactData.content.image_url} />
      )}
      {isFormArtifact && formArtifactData && sendUserMessage && (
        <FormArtifact
          artifactId={formArtifactData.artifact_id}
          content={formArtifactData.content}
          metadata={formArtifactData.metadata}
          handleSendUserMessage={handleSendUserMessage}
          isFilled={formArtifactData.metadata.is_filled || !!getFilledData(message.response_id)}
          filledData={getFilledData(message.response_id)}
          responseId={message.response_id}
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
        <AskAiCalendarArtifact
          content={{
            ...calendarArtifactData.content,
            artifact_id: calendarArtifactData.artifact_id,
          }}
          metadata={calendarArtifactData.metadata}
          handleSendUserMessage={handleSendUserMessage}
          isSubmitted={isCalendarSubmitted}
          artifactResponseId={message.response_id}
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
        <CtaEventMessage event={message} handleSendUserMessage={handleSendUserMessage} />
      )}
      {isConversationEvent && <ConversationEvent message={message} />}
      {message.role === 'user' && (
        <svg
          width="17"
          height="21"
          viewBox="0 0 17 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={svgClassName}
        >
          <path
            d="M16.8876 20.1846C11.6876 20.9846 6.55425 18.1212 4.88758 16.2879C6.60545 12.1914 -4.00033 2.24186 2.99967 2.24148C4.61828 2.24148 6.00073 -1.9986 11.8876 1.1846C11.9088 2.47144 11.8876 6.92582 11.8876 7.6842C11.8876 18.1842 17.8876 19.5813 16.8876 20.1846Z"
            fill="inherit"
          />
        </svg>
      )}
    </div>
  );
};
