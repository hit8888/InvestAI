import { cn, KatyIcon, typographyVariants, type AvatarComponentProps } from '@meaku/saral';
import type {
  ArtifactEventData,
  Message as MessageType,
  VideoArtifactData,
  SlideImageArtifactData,
} from '../../../types/message';
import { TextArtifact } from './TextArtifact';
import { VideoArtifact, ImageArtifact } from '@meaku/saral';
import { FormArtifact } from './FormArtifact';
import { AskAiCalendarArtifact } from './AskAiCalendarArtifact';
import { DiscoveryQuestion } from './DiscoveryQuestion';
import CtaEventMessage from '../../book-meeting/components/CtaEventMessage';
import { FormArtifactContent, FormArtifactMetadataType, CalendarArtifactContent } from '../../../utils/artifact';
import { SendUserMessageParams } from '../../../types/message';

interface MessageProps {
  message: MessageType;
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
  filledFormArtifactIds: string[];
  getFilledData: (artifactId: string) => Record<string, string>;
  filledQualificationArtifactIds: string[];
  getQualificationFilledData: (artifactId: string, responseId?: string) => Array<{ id: string; answer: string }>;
  isQualificationFilled: (artifactId: string, responseId?: string) => boolean;
  filledCalendarUrls?: string[];
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;
}

export const Message = ({
  message,
  sendUserMessage,
  filledFormArtifactIds,
  getFilledData,
  getQualificationFilledData,
  isQualificationFilled,
  filledCalendarUrls = [],
  selectedAvatar,
}: MessageProps) => {
  // Check if this is a video artifact
  const isTextArtifact = [
    'TEXT_REQUEST',
    'TEXT_RESPONSE',
    'STREAM_RESPONSE',
    'BOOK_MEETING',
    'SUGGESTED_QUESTION_CLICKED',
  ].includes(message.event_type);
  const isVideoArtifact = message.event_type === 'VIDEO_ARTIFACT';
  const isImageArtifact = message.event_type === 'SLIDE_IMAGE_ARTIFACT';
  const isCtaEvent = message.event_type === 'CTA_EVENT';

  const textContent = (message.event_data as { content: string })?.content as string;

  const videoArtifactData = isVideoArtifact
    ? ((message.event_data as ArtifactEventData).artifact_data as VideoArtifactData)
    : null;

  const imageArtifactData = isImageArtifact
    ? ((message.event_data as ArtifactEventData).artifact_data as SlideImageArtifactData)
    : null;

  const isFormArtifact = message.event_type === 'FORM_ARTIFACT';
  const isCalendarArtifact = message.event_type === 'CALENDAR_ARTIFACT';
  const isDiscoveryQuestion = message.event_type === 'DISCOVERY_QUESTIONS';
  const isSuggestionsArtifact = message.event_type === 'SUGGESTIONS_ARTIFACT';

  // Extract form artifact data
  const formArtifactData = isFormArtifact
    ? ((message.event_data as ArtifactEventData).artifact_data as {
        artifact_id: string;
        content: FormArtifactContent;
        metadata: FormArtifactMetadataType;
      })
    : null;

  // Extract calendar artifact data
  const calendarArtifactData = isCalendarArtifact
    ? ((message.event_data as ArtifactEventData).artifact_data as {
        artifact_id: string;
        content: CalendarArtifactContent;
        metadata: Record<string, unknown>;
      })
    : null;

  const qualificationQuestionsAnswered = formArtifactData
    ? isQualificationFilled(formArtifactData.artifact_id, message.response_id)
    : false;

  // Check if calendar artifact has been submitted by comparing URLs
  const isCalendarSubmitted = calendarArtifactData
    ? filledCalendarUrls.includes(calendarArtifactData.content.calendar_url)
    : false;

  // Extract discovery question data
  const discoveryQuestionData = isDiscoveryQuestion
    ? (message.event_data as {
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
    'mr-auto max-w-full pl-10': message.role === 'ai',
    'ml-auto max-w-[70%] bg-card  pl-3': message.role === 'user',
    [typographyVariants({ variant: 'body', fontWeight: 'normal' })]: true,
    '!max-w-full w-full':
      isVideoArtifact ||
      isImageArtifact ||
      isFormArtifact ||
      isCalendarArtifact ||
      isDiscoveryQuestion ||
      isSuggestionsArtifact ||
      isCtaEvent,
    'py-0 pr-0 pl-10': isFormArtifact || isDiscoveryQuestion,
    'p-0': isCalendarArtifact || isFormArtifact || isCtaEvent,
  });

  const svgClassName = cn({
    'absolute bottom-0': true,
    'fill-card -right-[5px]': message.role === 'user',
  });

  if (
    !isTextArtifact &&
    !videoArtifactData &&
    !imageArtifactData &&
    !isFormArtifact &&
    !isCalendarArtifact &&
    !isDiscoveryQuestion &&
    !isCtaEvent
  ) {
    return null;
  }

  return (
    <div className={containerClassName}>
      {message.role === 'ai' &&
        !isFormArtifact &&
        !isCalendarArtifact &&
        !isDiscoveryQuestion &&
        !isVideoArtifact &&
        !isImageArtifact &&
        !isSuggestionsArtifact &&
        !isCtaEvent &&
        (selectedAvatar ? (
          <selectedAvatar.Component className="absolute left-0 top-2 size-7" />
        ) : (
          <KatyIcon className="absolute left-0 top-2 size-7" />
        ))}
      {isTextArtifact && (
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
          isFilled={filledFormArtifactIds.includes(formArtifactData.artifact_id)}
          filledData={getFilledData(formArtifactData.artifact_id)}
          responseId={message.response_id}
          qualificationQuestionsAnswered={qualificationQuestionsAnswered}
          qualificationFilledData={getQualificationFilledData(formArtifactData.artifact_id, message.response_id)}
        />
      )}
      {isCalendarArtifact && calendarArtifactData && sendUserMessage && (
        <AskAiCalendarArtifact
          content={calendarArtifactData.content}
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
