import { SessionApiResponse, WebSocketMessage } from '../types';
import { ConversationDetailsDataResponse } from '../types/admin/admin';
import { OrganizationDetails } from '../types/admin/auth';
import DateUtil from './dateUtils';

export { checkIsArtifactMessage, checkIsEventMessage, isMessageAnalyticsEvent, isStreamMessage } from './messageUtils';

export const CONVERSATIONS_PAGE = 'conversations';
export const LEADS_PAGE = 'leads';
export const WEBPAGES_PAGE = 'webpages';
export const DOCUMENTS_PAGE = 'documents';
export const VIDEOS_PAGE = 'videos';
export const SLIDES_PAGE = 'slides';

export const DATA_SOURCE_TYPE_ENUM = {
  WEB_PAGE: 'WEB_PAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  SLIDE: 'SLIDE',
  CUSTOM_DOCUMENT: 'CUSTOM_DOCUMENT',
};

export const PAGES_WITH_DRAWER_ENABLED = [DOCUMENTS_PAGE, VIDEOS_PAGE, SLIDES_PAGE];

export const CONVERSATIONS_PINNED_COLUMNS = ['summary', 'country'];
export const LEADS_PINNED_COLUMNS = ['email', 'name'];
export const SHADOW_PINNED_COLUMNS = ['name', 'country'];

export const NON_SORTABLE_COLUMNS = ['duration'];

export const WIDTH_OF_SIDEBAR_OPEN = 270;
export const WIDTH_OF_SIDEBAR_CLOSED = 80;

export const CONTENT_CONTAINER_BOTHSIDE_PADDING_VALUE = 32;
export const DATA_SOURCE_CONTENT_CONTAINER_BOTHSIDE_PADDING_VALUE = 112;

export const WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_OPEN =
  WIDTH_OF_SIDEBAR_OPEN + CONTENT_CONTAINER_BOTHSIDE_PADDING_VALUE;
export const WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_SIDEBAR_CLOSED =
  WIDTH_OF_SIDEBAR_CLOSED + CONTENT_CONTAINER_BOTHSIDE_PADDING_VALUE;

export const WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_DATA_SOURCE_SIDEBAR_OPEN =
  WIDTH_OF_SIDEBAR_OPEN + DATA_SOURCE_CONTENT_CONTAINER_BOTHSIDE_PADDING_VALUE;
export const WIDTH_TO_BE_SUBTRACTED_FROM_SCREEN_WIDTH_FOR_DATA_SOURCE_SIDEBAR_CLOSED =
  WIDTH_OF_SIDEBAR_CLOSED + DATA_SOURCE_CONTENT_CONTAINER_BOTHSIDE_PADDING_VALUE;

export const RGB_PRIMARY_COLOR = 'rgb(var(--primary))';
export const RGB_WHITE_SHADE_COLOR = 'rgba(255, 255, 255, 0.32)';

export const setTenantIdentifier = (tenantObj: OrganizationDetails) => {
  localStorage.setItem('admin_tenant_identifier', JSON.stringify(tenantObj));
};

export const getTenantIdentifier = () => {
  try {
    const tenantIdentifier = localStorage.getItem('admin_tenant_identifier');
    return tenantIdentifier ? JSON.parse(tenantIdentifier) : null;
  } catch (error) {
    console.warn('Error getting tenant identifier from local storage', error);
    return null;
  }
};

export const getTenantFromLocalStorage = () => {
  return getTenantIdentifier()?.['tenant-name'];
};

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('accessToken');
};

export const getTenantActiveAgentId = () => {
  const tenantIdentifier = getTenantIdentifier();
  return tenantIdentifier?.agentId ?? 1;
};

export const getUserEmailFromLocalStorage = () => {
  return localStorage.getItem('userEmail');
};

export const setMessageIndexForAddingAIMessage = () => {
  const PROCESSING_MESSAGE_SEQUENCE = getProcessingMessageSequence();
  return Math.floor(Math.random() * PROCESSING_MESSAGE_SEQUENCE.length);
};

export const getProcessingMessageSequence = () => {
  return [`Putting together my answer`, `Getting it ready`, `Working on it`, `Forming a complete response`];
};

export const getMessageTimestamp = (timestamp?: string): string => {
  if (!timestamp) {
    return ''; // Return an empty string or a default value if timestamp is missing
  }

  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return ''; // Return an empty string or a default value if the date is invalid
  }

  // Convert to ISO string and format it
  return DateUtil.getDateValueInISOString(timestamp);
};

export const getTransformedResponse = (response: ConversationDetailsDataResponse | SessionApiResponse) => {
  return {
    ...response,
    chat_history: response.chat_history.map((message) => transformMessage(message)),
    conversation: 'conversation' in response ? response.conversation : null,
    feedback: 'feedback' in response ? response.feedback : [],
  };
};

export const transformMessage = (message: WebSocketMessage) => {
  // Create a deep copy of the message
  const transformedMessage = JSON.parse(JSON.stringify(message));

  // Check if it's an EVENT message with DISCOVERY_QUESTIONS
  if (transformedMessage.message_type === 'EVENT' && transformedMessage.message?.event_type === 'DISCOVERY_QUESTIONS') {
    // Handle case where response_options is an empty string or doesn't exist
    if (
      !transformedMessage.message?.event_data?.response_options ||
      transformedMessage.message.event_data.response_options === ''
    ) {
      transformedMessage.message.event_data.response_options = [];
    } else {
      // Filter out empty strings from response_options if it's an array
      transformedMessage.message.event_data.response_options =
        transformedMessage.message.event_data.response_options.filter((option: string) => option !== '');
    }
  }

  return transformedMessage;
};

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
};

export const toSentenceCase = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const ensureProtocol = (url: string): string => {
  if (!url) return '';
  try {
    return new URL(url).href;
  } catch {
    return `https://${url}`;
  }
};

export const MESSAGE_STATE = {
  EMPTY: 0,
  DEMO_START: 1,
  FIRST_AND_WELCOME: 2,
  FIRST_WELCOME_USER: 3,
  FIRST_WELCOME_LOADING_TEXT: 3,
} as const;
