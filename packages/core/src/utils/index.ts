import { OrganizationDetails } from '../types/admin/auth';
import DateUtil from './dateUtils';
export { isArtifactMessage, isEventMessage, isMessageAnalyticsEvent, isStreamMessage } from './messageUtils';

export const CONVERSATIONS_PAGE = 'conversations';
export const LEADS_PAGE = 'leads';

export const setTenantIdentifier = (tenantObj: OrganizationDetails) => {
  localStorage.setItem('admin_tenant_identifier', JSON.stringify(tenantObj));
};

export const getTenantIdentifier = () => {
  return JSON.parse(localStorage.getItem('admin_tenant_identifier') || 'null');
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
