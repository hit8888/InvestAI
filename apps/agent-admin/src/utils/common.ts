import { ENV } from '@meaku/core/types/env';
import {
  BANTItem,
  CONVERSATION_DETAILS_PAGESUMMARY_TAB_CONTENT_LIST,
  ConversationChipLabelEnum,
  CONVERSATIONS_TABLE_FILTERS_CONFIG,
  DOCUMENTS_TABLE_FILTERS_CONFIG,
  LEADS_TABLE_FILTERS_CONFIG,
  LINK_CLICKS_TABLE_FILTERS_CONFIG,
  SLIDE_TABLE_FILTERS_CONFIG,
  SortByIntentScore,
  SortBySessionLength,
  SortByTimestamp,
  SummaryTabContentList,
  TABLE_COLUMN_WIDTH_SIZE,
  USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD,
  VIDEOS_TABLE_FILTERS_CONFIG,
  WEBPAGES_TABLE_FILTERS_CONFIG,
} from './constants';
import {
  ConversationsTableDisplayContent,
  ConversationsTableViewContent,
  LeadsTableDisplayContent,
  LeadsTableViewContent,
  LocationWithCityCountry,
  TransformedProspectAndCompanyDetailsContent,
} from '@meaku/core/types/admin/admin';
import { ConversationRightSideDetailsType, FunnelData, FunnelStep } from './admin-types';
import {
  CONVERSATIONS_PAGE,
  DOCUMENTS_PAGE,
  ensureProtocol,
  LEADS_PAGE,
  LINK_CLICKS_PAGE,
  SLIDES_PAGE,
  toSentenceCase,
  VIDEOS_PAGE,
  WEBPAGES_PAGE,
} from '@meaku/core/utils/index';
import DateUtil from '@meaku/core/utils/dateUtils';
import { DateRangeProp, FilterType, FilterValues } from '@meaku/core/types/admin/filters';
import {
  SortValues,
  WebpagesSortValues,
  DocumentsSortValues,
  ArtifactsSortValues,
  DataSourceSortValues,
} from '@meaku/core/types/admin/sort';
import {
  EntityMetadataResponseType,
  EntityMetadataSchemaType,
  FilterItem,
  SortItem,
} from '@meaku/core/types/admin/api';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { isStreamMessage, isTextMessage } from '@meaku/core/utils/messageUtils';

const SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s]/g;
export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';
const {
  AllFilters,
  DateRange,
  IntentScore,
  Location,
  Company,
  MeetingBooked,
  ProductOfInterest,
  UserMessagesCount,
  TestConversationIncluded,
  UsageCount,
  Sources,
  Status,
  SearchTableContent,
  FileType,
} = FilterType;

const { convertDateToAppliedFilterValue, getDateDisplayForDateRange } = DateUtil;

export const getDashboardBasicPathURL = (tenantName: string) => {
  return `/${tenantName}`.replace(/\/+$/, '');
};

export const getUserNameFromLocalStorage = () => {
  const { username, first_name, last_name } = JSON.parse(localStorage.getItem('userInfo') ?? '{}');

  if (first_name || last_name) {
    return [first_name, last_name].join(' ');
  }

  return username;
};

export const getMappedDataFromResponseForLeadsTableView = (response: LeadsTableViewContent) => {
  const additionalInfoData =
    response.additional_info && Object.keys(response.additional_info).length > 0
      ? (response.additional_info as {
          city?: string;
          country?: string;
          buyer_intent?: string;
        })
      : null;
  const mappedData: LeadsTableDisplayContent = {
    email: response.email || '-',
    name: response.name || '-', // Fallback if name is null
    role: response.role !== 'Unknown' ? response.role || '-' : '-', // Handle 'Unknown' role
    company: response.company || '-', // Fallback if company is null
    country: {
      city: additionalInfoData?.city || '-',
      country: additionalInfoData?.country || response.country || '-',
    } as LocationWithCityCountry,
    timeline: response.created_on ? response.created_on : '-',
    product_interest: response.product_interest || '-',
    session_id: response.session_id ?? '',
    buyer_intent: additionalInfoData?.buyer_intent || '-',
    lead_type: getLeadTypeDisplayText(response.lead_type),
  };

  return mappedData;
};

export const getMappedDataFromResponseForConversationsTableView = (response: ConversationsTableViewContent) => {
  const prospectDetailsData =
    response.prospect_details && Object.keys(response.prospect_details).length > 0
      ? (response.prospect_details as {
          city?: string;
          country?: string;
        })
      : null;
  const mappedData: ConversationsTableDisplayContent = {
    company: response.company || '-',
    name: response.name || '-',
    email: response.email || '-',
    timestamp: response.timestamp || '',
    summary: response.summary || '-',
    country: {
      city: prospectDetailsData?.city || '-',
      country: prospectDetailsData?.country || response.country || '-',
    } as LocationWithCityCountry,
    budget: response.budget || '-',
    role: response.role || '-',
    authority: response.role || '-',
    need: response.need || '-',
    timeline: response.timeline || '-',
    buyer_intent_score: response.buyer_intent ?? '-', // Need to Find Logic or Directly getting from api
    bant_analysis: '-', // Need to Find Logic or Directly getting from api
    user_message_count: `${response.user_message_count || 0}`,
    meeting_status: '-', // Static for now, can be dynamic if additional info is provided
    product_of_interest: response.product_of_interest || '-',
    ip_address: response.ip_address || '-',
    session_id: response.session_id || '-',
    prospect_details: response?.prospect_details || {},
    company_details: response?.company_details || {},
  };

  return mappedData;
};

export const getProspectAndCompanyDetailsData = (
  conversation: ConversationsTableDisplayContent,
): TransformedProspectAndCompanyDetailsContent => {
  const {
    country,
    company,
    email,
    name,
    prospect_details: prospectDetails,
    company_details: companyDetails,
  } = conversation || {};
  const linkedInUrl = ensureProtocol(prospectDetails?.enriched_info?.linkedin_url || '');

  const transformedData: TransformedProspectAndCompanyDetailsContent = {
    prospect: {
      name: name || '-',
      email: email || '-',
      location: {
        city: prospectDetails?.city || '',
        country: prospectDetails?.country || (country as string) || '-',
      },
      enrichmentSource: prospectDetails?.enrichment_source || '',
      linkedInUrl,
    },
    company: {
      name: companyDetails?.company_name || company || '-',
      logoUrl: companyDetails?.website_url ? `${companyDetails?.website_url}/favicon.ico` : '',
      location: companyDetails?.company_country || (country as string) || '-',
      revenue: companyDetails?.company_revenue || '-',
      employees: companyDetails?.employee_count || '-',
      domain: companyDetails?.industry_domain || '-',
      foundationDate: '-',
      enrichmentSource: companyDetails?.enrichment_source || '',
    },
  };

  return transformedData;
};

// Function to find header value for a key, including nested object structures
export const getHeaderValueForKey = (
  key: string,
  columnHeaderLabelMapping: Record<string, string | Record<string, string>>,
): string | Record<string, string> => {
  // First, try direct key lookup
  const directValue = columnHeaderLabelMapping[key];
  if (directValue !== undefined) {
    return directValue;
  }

  // If not found directly, search through nested objects
  for (const value of Object.values(columnHeaderLabelMapping)) {
    if (typeof value === 'object' && value !== null) {
      // Check if the nested object contains our key
      if (key in value) {
        return value[key];
      }
    }
  }

  // If still not found, return empty string
  return '';
};

// Convert column list to the required format
export const getFormattedColumnsList = (
  columnsList: string[],
  columnHeaderLabelMapping: Record<string, string | Record<string, string>>,
) => {
  const formattedColumns = columnsList.map((key) => {
    const headerValue = getHeaderValueForKey(key, columnHeaderLabelMapping);
    const newItem = {
      id: key,
      accessorKey: key,
      header: headerValue,
      size: TABLE_COLUMN_WIDTH_SIZE, // Default size taken
    };

    return newItem;
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
    case Company:
      return {
        label: 'Company',
        width: '434px',
      };
    case Sources:
      return {
        label: 'Sources',
        width: '334px',
      };
    case FileType:
      return {
        label: 'File type',
        width: '334px',
      };
    case Status:
      return {
        label: 'Status',
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
    case UserMessagesCount:
      return {
        label: 'User messages count',
        width: '434px',
      };
    default:
      return {
        label: 'Filters',
        width: '424px',
      };
  }
};

export const getSortingAppliedValues = (sortState: SortValues | DataSourceSortValues, page: string) => {
  const isLeadsPage = page === LEADS_PAGE;
  const isLinkClicksPage = page === LINK_CLICKS_PAGE;
  const isMainTabPage = page === CONVERSATIONS_PAGE || page === LEADS_PAGE || page === LINK_CLICKS_PAGE;
  const isWebpagesPage = page === WEBPAGES_PAGE;
  const isDocumentsPage = page === DOCUMENTS_PAGE;
  const isVideosPage = page === VIDEOS_PAGE;
  const isSlidesPage = page === SLIDES_PAGE;
  const sortApplied: SortItem[] = [];
  const { timestampSort, sessionLengthSort, intentScoreSort } = sortState as SortValues;
  const { updated_onSort, statusSort, titleSort, urlSort } = sortState as WebpagesSortValues;
  const {
    updated_onSort: updated_onSortDocuments,
    source_nameSort,
    data_source_typeSort: data_source_typeSortDocuments,
    statusSort: statusSortDocuments,
  } = sortState as DocumentsSortValues;
  const {
    updated_onSort: updated_onSortArtifacts,
    statusSort: statusSortArtifacts,
    assetSort,
    descriptionSort,
  } = sortState as ArtifactsSortValues;

  if (isMainTabPage && timestampSort) {
    sortApplied.push({
      field: isLeadsPage || isLinkClicksPage ? 'created_on' : 'timestamp',
      order: timestampSort ? (timestampSort === SortByTimestamp.NEWEST_FIRST ? 'desc' : 'asc') : 'desc',
    });
  }

  if (isWebpagesPage) {
    if (updated_onSort) {
      sortApplied.push({
        field: 'updated_on',
        order: updated_onSort,
      });
    }

    if (statusSort) {
      sortApplied.push({
        field: 'status',
        order: statusSort,
      });
    }

    if (titleSort) {
      sortApplied.push({
        field: 'title',
        order: titleSort,
      });
    }

    if (urlSort) {
      sortApplied.push({
        field: 'url',
        order: urlSort,
      });
    }
  }

  if (isDocumentsPage) {
    if (source_nameSort) {
      sortApplied.push({
        field: 'asset',
        order: source_nameSort,
      });
    }

    if (statusSortDocuments) {
      sortApplied.push({
        field: 'status',
        order: statusSortDocuments,
      });
    }

    if (data_source_typeSortDocuments) {
      sortApplied.push({
        field: 'data_source_type',
        order: data_source_typeSortDocuments,
      });
    }

    if (updated_onSortDocuments) {
      sortApplied.push({
        field: 'updated_on',
        order: updated_onSortDocuments,
      });
    }

    if (descriptionSort) {
      sortApplied.push({
        field: 'title',
        order: descriptionSort,
      });
    }
  }

  if (isVideosPage || isSlidesPage) {
    if (updated_onSortArtifacts) {
      sortApplied.push({
        field: 'updated_on',
        order: updated_onSortArtifacts,
      });
    }

    if (statusSortArtifacts) {
      sortApplied.push({
        field: 'status',
        order: statusSortArtifacts,
      });
    }

    if (assetSort) {
      sortApplied.push({
        field: 'asset',
        order: assetSort,
      });
    }

    if (descriptionSort) {
      sortApplied.push({
        field: 'title',
        order: descriptionSort,
      });
    }
  }

  if (sessionLengthSort) {
    sortApplied.push({
      field: 'user_message_count',
      order: sessionLengthSort === SortBySessionLength.LONG_FIRST ? 'desc' : 'asc',
    });
  }
  if (intentScoreSort) {
    sortApplied.push({
      field: 'buyer_intent_score', // TODO: use buyer_intent
      order: intentScoreSort === SortByIntentScore.HIGHEST_FIRST ? 'desc' : 'asc',
    });
  }

  if (isMainTabPage && sortApplied.length === 0) {
    sortApplied.push({
      field: isLeadsPage ? 'created_on' : 'timestamp',
      order: 'desc',
    });
  }

  return sortApplied;
};

export const getSortValuesFromSortItems = (sortItems: SortItem[]): SortValues => {
  const sortValues: SortValues = {
    timestampSort: null,
    sessionLengthSort: null,
    intentScoreSort: null,
  };

  if (sortItems.length === 0) {
    sortValues.timestampSort = SortByTimestamp.NEWEST_FIRST;
    return sortValues;
  }

  sortItems.forEach((item) => {
    switch (item.field) {
      case 'created_on':
      case 'timestamp':
        sortValues.timestampSort = item.order === 'desc' ? SortByTimestamp.NEWEST_FIRST : SortByTimestamp.OLDEST_FIRST;
        break;
      case 'user_message_count':
        sortValues.sessionLengthSort =
          item.order === 'desc' ? SortBySessionLength.LONG_FIRST : SortBySessionLength.SHORT_FIRST;
        break;
      case 'buyer_intent_score': // TODO: use buyer_intent
        sortValues.intentScoreSort =
          item.order === 'desc' ? SortByIntentScore.HIGHEST_FIRST : SortByIntentScore.LOWEST_FIRST;
        break;
    }
  });

  // If no timestamp sort is set, default to the newest first
  if (!sortValues.timestampSort) {
    sortValues.timestampSort = SortByTimestamp.NEWEST_FIRST;
  }

  return sortValues;
};

export const getDateAppliedValue = (dateRange: DateRangeProp) => {
  const { startDate, endDate } = dateRange;
  if (!startDate) return '';

  const startDateFormatted = getDateDisplayForDateRange(startDate);

  // If the range includes only one date, format and return it
  if (!endDate || startDate === endDate) {
    return startDateFormatted; // Example: "Jan 15, 2025"
  }
  const endDateFormatted = getDateDisplayForDateRange(endDate);

  // Format and return the full date range
  return `${startDateFormatted} - ${endDateFormatted}`;
  // Example: "Jan 15, 2025 - Jan 20, 2025"
};

export const getFiltersConfig = (page: string) => {
  switch (page) {
    case CONVERSATIONS_PAGE:
      return CONVERSATIONS_TABLE_FILTERS_CONFIG;
    case LEADS_PAGE:
      return LEADS_TABLE_FILTERS_CONFIG;
    case LINK_CLICKS_PAGE:
      return LINK_CLICKS_TABLE_FILTERS_CONFIG;
    case WEBPAGES_PAGE:
      return WEBPAGES_TABLE_FILTERS_CONFIG;
    case DOCUMENTS_PAGE:
      return DOCUMENTS_TABLE_FILTERS_CONFIG;
    case VIDEOS_PAGE:
      return VIDEOS_TABLE_FILTERS_CONFIG;
    case SLIDES_PAGE:
      return SLIDE_TABLE_FILTERS_CONFIG;
    default:
      return [];
  }
};

export const getAllFilterAppliedValues = (filterState: FilterValues, page: string) => {
  const filterApplied: FilterItem[] = [];
  const isLeadsPage = page === LEADS_PAGE;
  const isConversationsPage = page === CONVERSATIONS_PAGE;
  const isLinkClicksPage = page === LINK_CLICKS_PAGE;
  const isVideosPage = page === VIDEOS_PAGE;
  const isSlidesPage = page === SLIDES_PAGE;
  const {
    dateRange,
    intentScore,
    location,
    productOfInterest,
    // meetingBooked,
    userMessagesCount,
    company,
    testConversationsIncluded,
    sources,
    // usageCount,
    // duration,
    status,
    fileType,
  } = filterState;

  if (dateRange?.startDate || dateRange?.endDate) {
    filterApplied.push({
      field: isLeadsPage ? 'created_on' : isConversationsPage ? 'timestamp' : 'updated_on',
      value: convertDateToAppliedFilterValue(dateRange.startDate!, dateRange.endDate!),
      operator: 'between',
    });
  }

  if (intentScore.length > 0) {
    filterApplied.push({
      field: 'buyer_intent',
      value: intentScore,
      operator: 'in',
    });
  }

  if (location.length > 0) {
    filterApplied.push({
      field: 'country',
      value: location,
      operator: 'in',
    });
  }

  if (sources.length > 0) {
    filterApplied.push({
      field: 'data_source_type',
      value: sources,
      operator: 'in',
    });
  }

  if (status.length > 0) {
    filterApplied.push({
      field: 'status',
      value: status,
      operator: 'in',
    });
  }

  if (company.length > 0) {
    filterApplied.push({
      field: 'company',
      value: company,
      operator: 'in',
    });
  }

  if (
    !isLeadsPage &&
    userMessagesCount.minCount > 0 &&
    userMessagesCount.maxCount <= 100 &&
    userMessagesCount.minCount < userMessagesCount.maxCount
  ) {
    filterApplied.push({
      field: 'user_message_count',
      value: [userMessagesCount.minCount, userMessagesCount.maxCount],
      operator: 'between',
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

  if (isConversationsPage) {
    filterApplied.push({
      field: 'is_test',
      value: testConversationsIncluded,
      operator: 'eq',
    });
  }

  if (isLeadsPage) {
    filterApplied.push(
      {
        field: 'is_valid',
        value: !testConversationsIncluded,
        operator: 'eq',
      },
      {
        field: 'email',
        value: null,
        operator: 'is_not_null',
      },
      {
        field: 'lead_type',
        value: 'GOAL_ACHIEVED',
        operator: 'eq',
      },
    );
  }

  if (isLinkClicksPage) {
    filterApplied.push({
      field: 'email',
      value: null,
      operator: 'eq',
    });
  }

  if (filterState.presetFilters) {
    filterApplied.push(...filterState.presetFilters);
  }

  if (fileType.length > 0) {
    filterApplied.push({
      field: 'data_source_type',
      value: fileType,
      operator: 'in',
    });
  }

  // Default filter for videos page
  if (isVideosPage) {
    filterApplied.push({
      field: 'data_source_type',
      value: 'VIDEO',
      operator: 'eq',
    });
  }

  // Default filter for slides page
  if (isSlidesPage) {
    filterApplied.push({
      field: 'data_source_type',
      value: 'SLIDE',
      operator: 'eq',
    });
  }

  return filterApplied;
};

export const collectAppliedFilters = (filters: FilterValues) => {
  const appliedFilters: { key: string; label: string; value: string | string[] | boolean }[] = [];

  const {
    dateRange,
    intentScore,
    location,
    productOfInterest,
    meetingBooked,
    userMessagesCount,
    company,
    testConversationsIncluded,
    sources,
    status,
    searchTableContent,
    usageCount,
    fileType,
  } = filters;

  if (dateRange) {
    appliedFilters.push({
      key: DateRange,
      label: 'Date',
      value: getDateAppliedValue(dateRange),
    });
  }

  if (testConversationsIncluded) {
    appliedFilters.push({
      key: TestConversationIncluded,
      label: 'Playground Conversations',
      value: `${testConversationsIncluded}`,
    });
  }

  if (intentScore.length > 0) {
    appliedFilters.push({
      key: IntentScore,
      label: 'Intent Score',
      value: getOrderedBuyerIntent(intentScore).join(', '),
    });
  }

  if (location.length > 0) {
    appliedFilters.push({
      key: Location,
      label: 'Location',
      value: location,
    });
  }

  if (company.length > 0) {
    appliedFilters.push({
      key: Company,
      label: 'Company',
      value: company,
    });
  }

  if (userMessagesCount.minCount > 0 && userMessagesCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD) {
    appliedFilters.push({
      key: UserMessagesCount,
      label: 'User messages count',
      value: `${userMessagesCount.minCount} - ${userMessagesCount.maxCount}`,
    });
  }

  if (usageCount.minCount > 0 && usageCount.maxCount <= USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD) {
    appliedFilters.push({
      key: UsageCount,
      label: 'Usage count',
      value: `${usageCount.minCount} - ${usageCount.maxCount}`,
    });
  }

  if (sources.length > 0) {
    appliedFilters.push({
      key: Sources,
      label: 'Sources',
      value: sources,
    });
  }

  if (fileType.length > 0) {
    appliedFilters.push({
      key: FileType,
      label: 'File type',
      value: fileType,
    });
  }

  if (status.length > 0) {
    appliedFilters.push({
      key: Status,
      label: 'Status',
      value: status,
    });
  }

  if (searchTableContent.length > 0) {
    appliedFilters.push({
      key: SearchTableContent,
      label: 'Search',
      value: searchTableContent,
    });
  }
  if (productOfInterest.length > 0) {
    appliedFilters.push({
      key: ProductOfInterest,
      label: 'Product',
      value: productOfInterest,
    });
  }

  if (meetingBooked) {
    appliedFilters.push({
      key: MeetingBooked,
      label: 'Meeting booked',
      value: meetingBooked,
    });
  }

  return appliedFilters;
};

const getBantItemsValue = (bantValue: BANTItem[], sessionData: ConversationsTableDisplayContent) => {
  const bantItems = (bantValue as BANTItem[]).map((bantItem) => {
    switch (bantItem.itemKey) {
      case 'budget':
        return {
          ...bantItem,
          itemValue: sessionData.budget || '-',
        };
      case 'authority':
        return {
          ...bantItem,
          itemValue: sessionData.role || '-',
        };
      case 'need':
        return {
          ...bantItem,
          itemValue: sessionData.need || '-',
        };
      case 'timeline':
        return {
          ...bantItem,
          itemValue: sessionData.timeline || '-',
        };
      default:
        return bantItem;
    }
  });

  return bantItems;
};

export function generateConversationSummaryContent(
  chatHistory: WebSocketMessage[],
  sessionData: ConversationsTableDisplayContent,
): SummaryTabContentList[] {
  const isChatHistoryAvailable = chatHistory.length > 0;
  // Calculate session duration
  const firstMessage = new Date(chatHistory[0]?.timestamp as string);
  const lastMessage = new Date(chatHistory[chatHistory.length - 1]?.timestamp as string);
  const sessionDuration = isChatHistoryAvailable
    ? Math.ceil((lastMessage.getTime() - firstMessage.getTime()) / (1000 * 60))
    : 0; // in minutes

  // Calculate highest intent score
  const highestIntentScore =
    sessionData?.buyer_intent_score ??
    (isChatHistoryAvailable && Array.isArray(chatHistory) && chatHistory.length > 0
      ? chatHistory.reduce((maxScore, msg) => {
          if (msg.message_type === 'EVENT' && msg.message?.event_type === 'MESSAGE_ANALYTICS') {
            const score = (msg.message?.event_data as { buyer_intent_score: number }).buyer_intent_score ?? 0;
            return Math.max(maxScore, score);
          }
          return maxScore;
        }, 0)
      : 0);

  // Count messages
  const aiMessageCount = chatHistory.filter(
    (msg) => msg.role === 'ai' && (isStreamMessage(msg) || isTextMessage(msg)),
  ).length;
  const userMessageCount = Number(sessionData.user_message_count);
  const totalMessageCount = aiMessageCount + userMessageCount;

  // Dynamically update CONVERSATION_DETAILS_PAGESUMMARY_TAB_CONTENT_LIST
  return CONVERSATION_DETAILS_PAGESUMMARY_TAB_CONTENT_LIST.map((item) => {
    switch (item.listKey) {
      case 'summary':
        return {
          ...item,
          listValue: sessionData.summary || 'No summary available',
        };
      case 'intentScore':
        return {
          ...item,
          listValue: highestIntentScore,
        };
      case 'bantAnalysis':
        return {
          ...item,
          listValue: getBantItemsValue(item.listValue as BANTItem[], sessionData),
        };
      case 'productOfInterest':
        return {
          ...item,
          listValue: sessionData.product_of_interest || '-',
        };
      case 'lengthOfConversation':
        return {
          ...item,
          listValue: isChatHistoryAvailable
            ? `${totalMessageCount} messages exchanged, including ${userMessageCount} user queries and ${aiMessageCount} AI responses.`
            : '-',
        };
      // case 'entryPoint':
      //   return {
      //     ...item,
      //     listValue: sessionData.entry_point || 'Not available',
      //   };
      case 'ipAddress':
        return {
          ...item,
          listValue: sessionData.ip_address || '-',
        };
      case 'sessionDuration':
        return {
          ...item,
          listValue: `${sessionDuration} minutes`,
        };
      default:
        return item;
    }
  });
}

export const getConversationRightSideDetailsItems = (
  dataObject: TransformedProspectAndCompanyDetailsContent['prospect' | 'company'],
  detailDataItems: ConversationRightSideDetailsType[],
) => {
  const addedValueObject = detailDataItems.map((item) => ({
    ...item,
    itemValue: dataObject[item.itemKey as keyof TransformedProspectAndCompanyDetailsContent['prospect' | 'company']],
  }));
  return addedValueObject.filter((item) => {
    // For Location object, check if any of the values are not '-'
    if (typeof item.itemValue === 'object' && item.itemValue !== null) {
      return Object.values(item.itemValue).some((value) => value !== '-' && value !== '');
    }
    return item.itemValue !== '-' && item.itemValue !== '';
  });
};

export const getDescendingOrderedOptions = (sortedFilterValues: string[], allFilterValues: string[]) => {
  // Create a set for quick lookup
  const sortedSet = new Set(sortedFilterValues);

  // Filter out filter values that are already in sortedFilterValues
  const otherFilterValues = allFilterValues.filter((loc) => !sortedSet.has(loc));

  // Combine sorted filter values first, then the rest of the other filter values
  const combined = [...sortedFilterValues, ...otherFilterValues];

  // Map each string to an object with value and label
  return combined.map((item) => ({ value: item, label: item }));
};

export const getStringWithBothCommaAND = (bantItemsWithDash: string[]) => {
  return bantItemsWithDash.length > 1
    ? bantItemsWithDash.slice(0, -1).join(', ') + ' and ' + bantItemsWithDash[bantItemsWithDash.length - 1]
    : bantItemsWithDash[0] || '';
};

export const getTransitionAnimation = () => ({
  transition: { duration: 0.5, ease: 'easeInOut' },
});

export const getProfileCTAInnerContainerAnimation = (isPanelOpen: boolean) => ({
  animate: {
    borderRadius: isPanelOpen ? '1rem' : '9999px',
  },
  transition: { duration: 0.5, ease: 'easeInOut' },
});

export const transformEntityDataToColumnHeaderLabelMapping = (inputArray: EntityMetadataResponseType) => {
  const result: Record<string, Record<string, string> | string> = {};

  inputArray.forEach((item: EntityMetadataSchemaType) => {
    const { parent_column, key_name, display_name } = item;

    if (parent_column) {
      if (!result[parent_column]) {
        result[parent_column] = {};
      }
      (result[parent_column] as Record<string, string>)[key_name] = display_name;
    } else {
      result[key_name] = display_name;
    }
  });

  return result;
};

export const getOrderedBuyerIntent = (intentScores: string[]): string[] => {
  const orderMap = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...intentScores].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    return (orderMap[aLower as keyof typeof orderMap] ?? 999) - (orderMap[bLower as keyof typeof orderMap] ?? 999);
  });
};

export const getIntegrationNameFromType = (integrationType: string | undefined): string => {
  if (!integrationType) {
    return 'Integration';
  }

  return toSentenceCase(integrationType.replace(SPECIAL_CHARS_REGEX, ' ').trim());
};

export const getLeadTypeDisplayText = (leadType: string | undefined): string => {
  if (leadType === 'GOAL_ACHIEVED') {
    return 'URL clicked';
  } else if (leadType === 'GOAL_PRESENTED') {
    return 'URL presented';
  }

  return '-';
};
