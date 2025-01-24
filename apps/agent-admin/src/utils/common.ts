import { ENV } from '@meaku/core/types/env';
import {
  ConversationChipLabelEnum,
  // INTENT_SCORE_VALUES,
  SortByIntentScore,
  SortBySessionLength,
  SortByTimestamp,
  UPPERCASE_COLUMN_WORDS,
} from './constants';
import {
  ConversationsTableDisplayContent,
  ConversationsTableViewContent,
  LeadsTableDisplayContent,
  LeadsTableViewContent,
} from '@meaku/core/types/admin/admin';
import { FunnelData, FunnelStep } from './admin-types';
import { getTenantIdentifier, LEADS_PAGE } from '@meaku/core/utils/index';
import { DateRangeProp } from '@meaku/core/types/admin/filters';
import { addDays, format } from 'date-fns';
import { FilterValues, FilterType } from '@meaku/core/types/admin/filters';
import { SortValues } from '@meaku/core/types/admin/sort';
import { SortItem, FilterItem } from '@meaku/core/types/admin/api';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';
const { AllFilters, DateRange, IntentScore, Location, MeetingBooked, ProductOfInterest } = FilterType;

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
  return getTenantIdentifier()?.['tenant-name'];
};

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('accessToken');
};

export const getMappedDataFromResponseForLeadsTableView = (response: LeadsTableViewContent) => {
  const mappedData: LeadsTableDisplayContent = {
    email: response.email || '-',
    name: response.name || '-', // Fallback if name is null
    role: response.role !== 'Unknown' ? response.role || '-' : '-', // Handle 'Unknown' role
    company: response.company || '-', // Fallback if company is null
    location: response.country || '-',
    timestamp: response.created_on ? new Date(response.created_on).toISOString().replace('T', ' ').split('.')[0] : '-',
    product_of_interest: response.product_interest || '-',
  };

  return mappedData;
};

export const getMappedDataFromResponseForConversationsTableView = (response: ConversationsTableViewContent) => {
  const mappedData: ConversationsTableDisplayContent = {
    company: response.company || '-',
    name: response.name || '-',
    email: response.email || '-',
    timestamp: response.timestamp ? new Date(response.timestamp).toISOString().replace('T', ' ').split('.')[0] : '-',
    conversation_preview: response.summary || '-',
    location: response.country || '-',
    buyer_intent: '-', // Need to Find Logic or Directly getting from api
    bant_analysis: '-', // Need to Find Logic or Directly getting from api
    number_of_user_messages: `${response.user_message_count || 0}`,
    meeting_status: '-', // Static for now, can be dynamic if additional info is provided
    product_of_interest: response.product_of_interest || '-',
    ip_address: response.ip_address || '-',
    session_id: response.session_id || '-',
  };

  return mappedData;
};

export const getProspectAndCompanyDetailsData = (conversation: ConversationsTableDisplayContent) => {
  const transformedData = {
    prospect: {
      name: conversation.name ?? '-',
      email: conversation.email ?? '-',
      location: conversation.location ?? '-',
    },
    company: {
      name: conversation.company ?? '-',
      logoUrl: '', // Placeholder; replace with actual logo if available
      location: conversation.location ?? '-', // Adjust if different from prospect's location
      revenue: '-', // Placeholder
      employees: '-', // Placeholder
      domain: '-', // Placeholder
      foundationDate: '-', // Placeholder
    },
  };
  return transformedData;
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
    funnelNumericLabel: '-', // No count for traffic
    funnelKey: ConversationChipLabelEnum.TOTAL_TRAFFIC,
  };

  return [totalTrafficItem, ...mappedSteps];
};

export const getFilterHeaderLabel = (filterState: string) => {
  switch (filterState) {
    case AllFilters:
      return {
        label: 'Filters',
        width: '424px',
      };
    case DateRange:
      return {
        label: '',
        width: '100%',
      };
    case IntentScore:
      return {
        label: 'Intent score',
        width: '284px',
      };
    case Location:
      return {
        label: 'Location',
        width: '334px',
      };
    case MeetingBooked:
      return {
        label: 'Meeting booked',
        width: '254px',
      };
    case ProductOfInterest:
      return {
        label: 'Product of Interest',
        width: '324px',
      };
    default:
      return {
        label: 'Filters',
        width: '424px',
      };
  }
};

export const formatDateDisplay = (date: DateRangeProp | undefined) => {
  if (!date?.from) return 'Pick date';

  if (!date.to || date.from === date.to) {
    return format(date.from, 'LLL dd, y');
  }

  return `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`;
};

const convertDateToAppliedFilterValue = (dateRange: string) => {
  // there's a timezone issue in the date conversion.
  // When you create a new Date from the string "Jan 15, 2025",
  // it uses the local timezone (in this case IST/GMT+0530),
  // but when converting to ISO string, it adjusts to UTC,
  // causing the date to appear as January 14th in the UTC timezone.
  const startDateStr = dateRange.split(' - ')[0];
  const startDate = addDays(new Date(startDateStr), 1); // Explained Above
  startDate.setUTCHours(0, 0, 0, 0);
  const formattedStartDate = startDate.toISOString();

  return `${formattedStartDate}`;

  // Split the date range into start and end dates
  // const [startDateStr, endDateStr] = dateRange.split(" - ");

  // // Parse the start and end dates
  // const startDate = new Date(startDateStr);
  // const endDate = new Date(endDateStr);

  // // Set the end date to the end of the day (23:59:59.999)
  // endDate.setHours(23, 59, 59, 999);

  // // Format the dates into ISO 8601 format
  // const formattedStartDate = startDate.toISOString(); // "2025-01-03T00:00:00.000Z"
  // const formattedEndDate = endDate.toISOString(); // "2025-01-23T23:59:59.999Z"

  // return [`${formattedStartDate}`, `${formattedEndDate}`];
};

export const getSortingAppliedValues = (sortState: SortValues, page: string) => {
  const isLeadsPage = page === LEADS_PAGE;
  const sortApplied: SortItem[] = [];
  const { timestampSort, sessionLengthSort, intentScoreSort } = sortState;
  if (timestampSort) {
    sortApplied.push({
      field: isLeadsPage ? 'created_on' : 'timestamp',
      order: timestampSort ? (timestampSort === SortByTimestamp.NEWEST_FIRST ? 'desc' : 'asc') : 'desc',
    });
  }
  if (sessionLengthSort) {
    sortApplied.push({
      field: 'user_message_count',
      order: sessionLengthSort === SortBySessionLength.LONG_FIRST ? 'desc' : 'asc',
    });
  }
  if (intentScoreSort) {
    sortApplied.push({
      field: 'buyer_intent_score',
      order: intentScoreSort === SortByIntentScore.HIGHEST_FIRST ? 'desc' : 'asc',
    });
  }

  if (sortApplied.length === 0) {
    sortApplied.push({
      field: isLeadsPage ? 'created_on' : 'timestamp',
      order: 'desc',
    });
  }

  return sortApplied;
};
export const getAllFilterAppliedValues = (filterState: FilterValues, page: string) => {
  const filterApplied: FilterItem[] = [];
  const isLeadsPage = page === LEADS_PAGE;
  const {
    dateRange,
    // intentScore,
    location,
    productOfInterest,
    // meetingBooked,
  } = filterState;

  // TODOS: NEED TO FIX THE LOGIC FOR DATE RANGE FILTER
  if (dateRange) {
    filterApplied.push({
      field: isLeadsPage ? 'created_on' : 'timestamp',
      value: convertDateToAppliedFilterValue(formatDateDisplay(dateRange)),
      operator: 'gte',
      // operator: 'between',
    });
  }
  // if(intentScore.length > 0) {
  //   // Get the minimum score from selected intent levels
  //   const minScore = Math.min(
  //     ...intentScore.map(level => INTENT_SCORE_VALUES[level as keyof typeof INTENT_SCORE_VALUES])
  //   );
  //   filterApplied.push({
  //     field: 'buyer_intent_score', // Field 'buyer_intent_score' expected a number but got 'lead'.
  //     value: minScore,
  //     operator: 'gte'
  //   })
  // }
  if (location.length > 0) {
    filterApplied.push({
      field: 'country',
      value: location,
      operator: 'in',
    });
  }
  if (productOfInterest.length > 0) {
    filterApplied.push({
      field: 'product_of_interest',
      value: productOfInterest,
      operator: 'in',
    });
  }

  // if (meetingBooked) {
  //   filterApplied.push({
  //     field: 'meeting_status',
  //     value: meetingBooked, // e.g., 'all' or 'yes' or 'no'
  //     operator: 'eq',
  //   });
  // }

  return filterApplied;
};

export const collectAppliedFilters = (filters: FilterValues) => {
  const appliedFilters: { key: string; label: string; value: string | string[] }[] = [];

  if (filters.dateRange) {
    appliedFilters.push({
      key: DateRange,
      label: 'Date',
      value: formatDateDisplay(filters.dateRange),
    });
  }

  if (filters.intentScore.length > 0) {
    appliedFilters.push({
      key: IntentScore,
      label: 'Intent Score',
      value: filters.intentScore.join(', '),
    });
  }

  if (filters.location.length > 0) {
    appliedFilters.push({
      key: Location,
      label: 'Location',
      value: filters.location,
    });
  }

  if (filters.productOfInterest.length > 0) {
    appliedFilters.push({
      key: ProductOfInterest,
      label: 'Product',
      value: filters.productOfInterest.join(', '),
    });
  }

  if (filters.meetingBooked) {
    appliedFilters.push({
      key: MeetingBooked,
      label: 'Meeting booked',
      value: filters.meetingBooked,
    });
  }

  return appliedFilters;
};
