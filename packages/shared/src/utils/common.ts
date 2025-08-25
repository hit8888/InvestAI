import { nanoid } from 'nanoid';
import { CtaEventDataContent, ArtifactFormType, FormFilledEventType } from './types';
import { ArtifactContent, CalendarArtifactContent, FormArtifactContent } from './artifact';
import { Message, MessageEventType, ArtifactMessageContent } from '../types/message';
import { FormConfigResponse } from '../types/responses';

const { FORM_FILLED, QUALIFICATION_FORM_FILLED, CALENDAR_SUBMIT } = MessageEventType;

export const BASE_ARTIFACT_TYPES = ['SLIDE', 'SLIDE_IMAGE', 'VIDEO', 'FORM', 'CALENDAR', 'QUALIFICATION_FORM'] as const;
export const SUPPORTED_ARTIFACT_TYPES = [...BASE_ARTIFACT_TYPES] as const;
export type SupportedArtifactType = (typeof SUPPORTED_ARTIFACT_TYPES)[number];

const isSuggestionArtifact = (msg: Message) => msg.event_type === MessageEventType.SUGGESTIONS_ARTIFACT;

// Check if the artifact message is a form
const checkIsFormArtifactBase = (message: Message): message is Message & { event_data: ArtifactMessageContent } => {
  return (
    checkIsArtifactMessage(message) &&
    (message.event_type === 'FORM_ARTIFACT' || message.event_type === 'QUALIFICATION_FORM_ARTIFACT') &&
    !!message.event_data.artifact_data?.content
  );
};

export const checkMessageIsFormFilled = (msg: Message, eventType: FormFilledEventType) => {
  return (
    msg.event_type === eventType &&
    'event_data' in msg &&
    ((eventType === FORM_FILLED && 'form_data' in msg.event_data) ||
      (eventType === CALENDAR_SUBMIT && 'form_data' in msg.event_data) ||
      (eventType === QUALIFICATION_FORM_FILLED && 'qualification_responses' in msg.event_data))
  );
};

const checkIfFormFilledMessageExists = (messages: Message[], eventType: FormFilledEventType) => {
  return messages.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactFormType;
    } => checkMessageIsFormFilled(msg, eventType),
  );
};

export const getMessagesWithSameResponseId = (messages: Message[], responseId: string) => {
  return messages.filter((msg) => msg.response_id === responseId);
};

export const checkIsArtifactMessage = (message: Message) => {
  return (
    message.event_data &&
    'artifact_data' in message.event_data &&
    'artifact_type' in message.event_data &&
    (isMediaArtifact(message.event_data.artifact_type) || isSuggestionArtifact(message))
  );
};

export const isCtaEvent = (
  message: Message,
  align?: CtaEventDataContent['align'],
): message is Message & {
  event_data: CtaEventDataContent;
} => {
  return message?.event_type === 'CTA_EVENT' && (!align || message.event_data?.align === align);
};

export const isMediaArtifact = (type: string): type is SupportedArtifactType => {
  return SUPPORTED_ARTIFACT_TYPES.includes(type as SupportedArtifactType);
};

export const isCalendarArtifact = (msg: Message) => msg.event_type === MessageEventType.CALENDAR_ARTIFACT;

export const checkIsQualificationFormArtifact = (message: Message): boolean => {
  if (!checkIsFormArtifactBase(message)) return false;
  const content = message.event_data?.artifact_data?.content;
  return content !== null && 'qualification' in content && Boolean(content.qualification);
};

export const findArtifactMessageWithSameEventTypeAndResponseId = (
  messages: Message[],
  messageEventType: string,
  responseId: string,
) => {
  return messages.find(
    (
      message,
    ): message is Message & {
      event_data: ArtifactMessageContent & { artifact_data: ArtifactContent | FormArtifactContent };
    } => {
      if (message.role !== 'ai' || !checkIsArtifactMessage(message)) return false;
      return message.event_type === messageEventType && message.response_id === responseId;
    },
  );
};

export const getCalendarArtifactMessage = (messagesWithSameResponseId: Message[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactMessageContent & {
        artifact_data: CalendarArtifactContent;
      };
    } =>
      checkIsArtifactMessage(msg) &&
      msg.event_type === 'CALENDAR_ARTIFACT' &&
      msg.event_data &&
      'artifact_data' in msg.event_data,
  );
};

export const getCtaEvent = (
  messages: Message[],
  responseId?: string | undefined,
  align?: CtaEventDataContent['align'],
) => {
  return messages.find(
    (
      msg,
    ): msg is Message & {
      event_data: CtaEventDataContent;
    } => isCtaEvent(msg, align) && (!responseId || msg.response_id === responseId),
  );
};

export const getFormArtifactMessage = (messagesWithSameResponseId: Message[]) => {
  return messagesWithSameResponseId.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactMessageContent & {
        artifact_data: FormArtifactContent;
      };
    } => checkIsFormArtifactBase(msg),
  );
};

export const getQualificationFormArtifactMessage = (messagesWithSameResponseId: Message[]) => {
  return messagesWithSameResponseId.find(
    (msg) => msg.event_type === 'QUALIFICATION_FORM_ARTIFACT' && 'artifact_data' in msg.event_data,
  );
};

export const getFormFilledEventByArtifactId = (
  messages: Message[],
  responseId: string,
  eventType: FormFilledEventType,
) => {
  if (!responseId.length) return null;
  return messages.find(
    (
      msg,
    ): msg is Message & {
      event_data: ArtifactFormType;
    } => 'event_data' in msg && responseId === msg.response_id && checkMessageIsFormFilled(msg, eventType),
  );
};

export const checkIfSubmissionEventsPresent = (messages: Message[], hideContent: boolean = false) => {
  const isFormFilledEventMessageExist = checkIfFormFilledMessageExists(messages, FORM_FILLED);
  const isQualificationFormFiledEventMessageExist = checkIfFormFilledMessageExists(messages, QUALIFICATION_FORM_FILLED);
  const isCalendarSubmitEventMessageExist = checkIfFormFilledMessageExists(messages, CALENDAR_SUBMIT);

  const isQualificationFormArtifact = messages.find((message) => checkIsQualificationFormArtifact(message));
  const isCalendarArtifactExist = messages.find((message) => isCalendarArtifact(message));

  // If qualification form is filled
  if (isQualificationFormFiledEventMessageExist) {
    // Check if calendar artifact is present, if yes show CTA (return true)
    if (isCalendarArtifactExist && hideContent) {
      return true;
    }
    // If no calendar artifact after qualification form filled, hide CTA
    return false;
  }

  // If form is filled and no qualification form exists, check for calendar flow
  if (isFormFilledEventMessageExist && !isQualificationFormArtifact) {
    // If calendar artifact exists after form filled, check if calendar is submitted
    if (isCalendarArtifactExist) {
      // Hide CTA if calendar is submitted
      return !isCalendarSubmitEventMessageExist;
    }
    // If no calendar artifact, hide CTA (original behavior)
    return false;
  }

  return true;
};

export const convertBookMeetingFormDataToFormArtifactMessage = (
  formArtifactData: FormConfigResponse,
  sessionId: string,
  responseId: string | undefined,
) => {
  return {
    session_id: sessionId,
    response_id: responseId ?? nanoid(),
    role: 'ai' as const,
    actor: 'ARTIFACT' as const,
    event_type: MessageEventType.FORM_ARTIFACT,
    event_data: {
      artifact_type: 'FORM',
      artifact_data: {
        artifact_id: '',
        content: {
          default_message: formArtifactData.form_config.form_data.default_message,
          form_fields: formArtifactData.form_config.form_data.form_fields,
          qualification: formArtifactData.form_config.qualification,
          function: formArtifactData.form_config.form_data.function,
          qualification_questions: formArtifactData.form_config.qualification_questions,
          default_data: formArtifactData.form_config.default_data,
        },
        artifact_type: 'FORM',
        metadata: {
          is_filled: false,
          filled_data: {},
          country: formArtifactData.form_config.default_data.country,
          country_code: formArtifactData.form_config.default_data.country_code,
        },
        error: null,
        error_code: null,
      },
    },
    documents: [],
    command_bar_module_id: null,
  };
};
