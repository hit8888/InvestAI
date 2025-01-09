import { ENV } from '@meaku/core/types/env';
import { ConversationChipLabelEnum, UPPERCASE_COLUMN_WORDS } from './constants';
import {
  ConversationsTableDisplayContent,
  ConversationsTableViewContent,
  LeadsTableDisplayContent,
  LeadsTableViewContent,
} from '@meaku/core/types/admin/admin';
import { FunnelData, FunnelStep } from './admin-types';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';

// Function to trigger the download
export const handleDownload = (fileType: string, linkUrl: string, downloadedFileName: string) => {
  const url = linkUrl;
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.setAttribute('download', `${downloadedFileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Invalid file type selected');
  }
};

export const getTenantFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('tenant_identifier') || 'null')?.['tenant-name'];
};

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('accessToken');
};

export const getMappedDataFromResponseForLeadsTableView = (response: LeadsTableViewContent) => {
  const mappedData: LeadsTableDisplayContent = {
    email: response.email || 'N/A',
    name: response.name || 'N/A', // Fallback if name is null
    role: response.role !== 'Unknown' ? response.role || 'N/A' : 'N/A', // Handle 'Unknown' role
    company: response.company || 'N/A', // Fallback if company is null
    location: response.country || 'N/A',
    timestamp: response.created_on
      ? new Date(response.created_on).toISOString().replace('T', ' ').split('.')[0]
      : 'N/A',
    product_of_interest: response.product_interest || 'N/A',
  };

  return mappedData;
};

export const getMappedDataFromResponseForConversationsTableView = (response: ConversationsTableViewContent) => {
  const mappedData: ConversationsTableDisplayContent = {
    company: response.company || 'Unknown Company',
    name: response.name || 'Anonymous',
    email: response.email || 'Not provided',
    timestamp: response.timestamp ? new Date(response.timestamp).toISOString().replace('T', ' ').split('.')[0] : 'N/A',
    conversation_preview: response.summary || 'No conversation preview',
    location: response.country || 'N/A',
    buyer_intent: 'N/A', // Need to Find Logic or Directly getting from api
    bant_analysis: 'N/A', // Need to Find Logic or Directly getting from api
    number_of_user_messages: `${response.user_message_count || 0}`,
    meeting_status: 'N/A', // Static for now, can be dynamic if additional info is provided
    product_of_interest: response.product_of_interest || 'No product specified',
    ip_address: response.ip_address || 'IP not available',
    session_id: response.session_id || 'Session ID missing',
  };

  return mappedData;
};

// Helper function to capitalize specific words
const capitalizeWord = (word: string, capitalizeWords: string[]): string => {
  if (capitalizeWords.includes(word.toLowerCase())) {
    return word.toUpperCase();
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Convert column list to the required format
export const getFormattedColumnsList = (columnsList: string[], sizeGiven?: number) => {
  const formattedColumns = columnsList.map((key) => {
    const words = key.split('_');
    const header = words.map((word) => capitalizeWord(word, UPPERCASE_COLUMN_WORDS)).join(' ');

    const newItem = {
      id: key,
      accessorKey: key,
      header: header,
    };

    return sizeGiven
      ? {
          ...newItem,
          size: sizeGiven,
        }
      : newItem;
  });
  return formattedColumns;
};

// Transform steps into desired format
export const transformFunnelData = (steps: FunnelStep[]): FunnelData[] => {
  // Map the steps to FunnelData format
  const mappedSteps = steps.map((step) => {
    let funnelChipType: ConversationChipLabelEnum;

    switch (step.name) {
      case 'Total Conversations':
        funnelChipType = ConversationChipLabelEnum.TOTAL_CONVERSATIONS;
        break;
      case 'High-Intent Conversations':
        funnelChipType = ConversationChipLabelEnum.HIGH_INTENT_CONVERSATIONS;
        break;
      case 'Lead Generated':
        funnelChipType = ConversationChipLabelEnum.LEAD_GENERATED;
        break;
      default:
        throw new Error(`Unknown step name: ${step.name}`);
    }

    return {
      funnelChipType,
      funnelChipLabel: step.name,
      funnelNumericLabel: step.count.toLocaleString(), // Format number with commas
      funnelKey: funnelChipType,
    };
  });

  // TODOS: For Now, Adding the "Total Traffic" item manually - It will come in API response as well LATER ON
  const totalTrafficItem: FunnelData = {
    funnelChipType: ConversationChipLabelEnum.TOTAL_TRAFFIC,
    funnelChipLabel: 'Total Traffic',
    funnelNumericLabel: 'N/A', // No count for traffic
    funnelKey: ConversationChipLabelEnum.TOTAL_TRAFFIC,
  };

  return [totalTrafficItem, ...mappedSteps];
};
