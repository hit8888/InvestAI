import { SPECIAL_CHARS_REGEX } from '../constants/regex';
import apiClient from '../http/client';
import { OrganizationDetailsResponse, SessionApiResponse, WebSocketMessage } from '../types';
import { ConversationDetailsDataResponse, PaginationPageType } from '../types/admin/admin';
import DateUtil from './dateUtils';
import isEqual from 'lodash/isEqual';

export { checkIsArtifactMessage, checkIsEventMessage, isMessageAnalyticsEvent, isStreamMessage } from './messageUtils';

export const CONVERSATIONS_PAGE = 'conversations';
export const LEADS_PAGE = 'leads';
export const LINK_CLICKS_PAGE = 'link-clicks';
export const VISITORS_PAGE = 'prospects';
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

export const PageTypeToTableName: Record<PaginationPageType, string> = {
  [CONVERSATIONS_PAGE]: 'conversations',
  [LEADS_PAGE]: 'leads',
  [LINK_CLICKS_PAGE]: 'leads',
  [VISITORS_PAGE]: 'prospects',
  [WEBPAGES_PAGE]: 'webpages',
  [DOCUMENTS_PAGE]: 'documents',
  [VIDEOS_PAGE]: 'artifacts',
  [SLIDES_PAGE]: 'artifacts',
};

export const PAGES_WITH_DRAWER_ENABLED = [DOCUMENTS_PAGE, VIDEOS_PAGE, SLIDES_PAGE];

export const CONVERSATIONS_PINNED_COLUMNS = ['timestamp', 'country'];
export const LEADS_PINNED_COLUMNS = ['timeline', 'country'];
export const VISITORS_PINNED_COLUMNS = ['company', 'website_url'];
export const SHADOW_PINNED_COLUMNS = ['name', 'country', 'website_url'];

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
export const BREAKOUT_COLOR = '#4E46DC';

export const getTenantIdentifier = () => {
  try {
    const value = localStorage.getItem('admin_tenant_identifier');
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as OrganizationDetailsResponse;
  } catch (error) {
    console.warn('Error reading tenant identifier:', error);
    return null;
  }
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

  return DateUtil.humanizeMessageTimestamp(timestamp);
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

export const toDisplayText = (text?: string | null) => {
  if (!text) return '';
  return toSentenceCase(text.replace(SPECIAL_CHARS_REGEX, ' ').trim());
};

export const ensureProtocol = (url: string): string => {
  if (!url) return '';
  try {
    return new URL(url).href;
  } catch {
    return `https://${url}`;
  }
};

export const extractLinkedInUsername = (url: string): string => {
  const match = url.match(/linkedin\.com\/in\/([^/?]+)/);
  return match ? match[1] : '';
};

export const jsonSafeParse = (jsonString: string) => {
  try {
    const data = JSON.parse(jsonString);
    return { data };
  } catch (error) {
    return { error };
  }
};

export const MESSAGE_STATE = {
  EMPTY: 0,
  DEMO_START: 1,
  FIRST_AND_WELCOME: 2,
  FIRST_WELCOME_USER: 3,
  FIRST_WELCOME_LOADING_TEXT: 3,
} as const;

export const deepCompare = (obj1: unknown, obj2: unknown): boolean => {
  return isEqual(obj1, obj2);
};

export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url?: string): string => {
  if (!url) return '';
  return url.split('?')[0].split('#')[0].replace(/\/$/, '');
};

export const extractDomain = (url?: string): string => {
  if (!url) return '';
  try {
    const fullUrl = url.includes('://') ? url : `https://${url}`;
    const urlObj = new URL(fullUrl);
    return urlObj.hostname;
  } catch {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const withoutWww = cleanUrl.replace(/^www\./, '');
    const domain = withoutWww.split(/[/?#]/)[0];
    return domain;
  }
};

const getDomainFromEmail = (email: string | undefined) => {
  if (!email) return undefined;
  return email.split('@')[1];
};

export const getCompanyLogoSrc = (url: string): string => {
  const domain = extractDomain(url) ?? getDomainFromEmail(url);
  return `https://cdn.brandfetch.io/${domain}/fallback/lettermark/w/400/h/400?c=1idxCHNxROyEqcB0wCy`;
};

export const getCompanyLogoSrcByName = async (name: string): Promise<string> => {
  try {
    const res = await apiClient.get(`https://api.brandfetch.io/v2/search/${name}?c=1idxCHNxROyEqcB0wCy`);
    const icon = res.data[0].icon;
    return icon;
  } catch (error) {
    console.error('Error getting company logo src by name', error);
    return '';
  }
};

export const downloadFromUrl = (url: string, filename: string, doneCallback?: () => void) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      doneCallback?.();
    })
    .catch((error) => {
      console.error('Error downloading from url', error);
      doneCallback?.();
    });
};

export const convertBytesToMB = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2);
};

export const extractFilenameFromUrl = (url: string): string => {
  if (!url) return '';
  try {
    // Remove query parameters and fragments
    const urlWithoutParams = url.split('?')[0].split('#')[0];
    // Extract the last segment after the last '/'
    const filename = urlWithoutParams.split('/').pop() || '';
    return filename;
  } catch {
    return 'Breakout file';
  }
};
