import { ENV } from '@neuraltrade/core/types/env';
import {
  BANTItem,
  CONVERSATION_DETAILS_PAGESUMMARY_TAB_CONTENT_LIST,
  ConversationChipLabelEnum,
  CONVERSATIONS_TABLE_FILTERS_CONFIG,
  ARTIFACTS_SORT_KEY_TO_FIELD_MAP,
  DOCUMENTS_SORT_KEY_TO_FIELD_MAP,
  DOCUMENTS_TABLE_FILTERS_CONFIG,
  FIELD_TO_SORT_KEY_MAP,
  INITIAL_SORT_VALUES,
  LEADS_TABLE_FILTERS_CONFIG,
  LINK_CLICKS_TABLE_FILTERS_CONFIG,
  SLIDE_TABLE_FILTERS_CONFIG,
  SORT_KEY_TO_FIELD_MAP,
  SummaryTabContentList,
  TABLE_COLUMN_WIDTH_SIZE,
  USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD,
  VIDEOS_TABLE_FILTERS_CONFIG,
  WEBPAGES_SORT_KEY_TO_FIELD_MAP,
  WEBPAGES_TABLE_FILTERS_CONFIG,
  VISITORS_TABLE_FILTERS_CONFIG,
  ONE_MB_IN_BYTES,
} from './constants';
import {
  ConversationsTableDisplayContent,
  ConversationsTableViewContent,
  LeadsTableDisplayContent,
  LeadsTableViewContent,
  LocationWithCityCountry,
  SessionDetailsDataResponse,
  ConversationDetailsDataResponse,
  TransformedProspectAndCompanyDetailsContent,
  VisitorsTableDisplayContent,
  VisitorsTableViewContent,
} from '@neuraltrade/core/types/admin/admin';
import {
  ConversationRightSideDetailsType,
  FunnelData,
  FunnelStep,
  DistributionItem,
  PieChartDataItem,
} from './admin-types';
import {
  CONVERSATIONS_PAGE,
  DOCUMENTS_PAGE,
  ensureProtocol,
  isUrl,
  LEADS_PAGE,
  LINK_CLICKS_PAGE,
  SLIDES_PAGE,
  toDisplayText,
  VIDEOS_PAGE,
  VISITORS_PAGE,
  WEBPAGES_PAGE,
} from '@neuraltrade/core/utils/index';
import DateUtil from '@neuraltrade/core/utils/dateUtils';
import { DateRangeProp, FilterType, FilterValues } from '@neuraltrade/core/types/admin/filters';
import { SortValues, DataSourceSortValues, SortKeyToFieldMap } from '@neuraltrade/core/types/admin/sort';
import {
  EntityMetadataResponseType,
  EntityMetadataSchemaType,
  FilterItem,
  OrganizationDetailsResponse,
  type SdrAssignment,
  SortItem,
} from '@neuraltrade/core/types/admin/api';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { isStreamMessage, isTextMessage } from '@neuraltrade/core/utils/messageUtils';
import NumberUtil from '@neuraltrade/core/utils/numberUtils';
import { capitalizeString } from '../../../agent/src/utils/common';

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
  ProductInterest,
  UserMessagesCount,
  TestConversationIncluded,
  SessionIdIncluded,
  UsageCount,
  Sources,
  Status,
  SearchTableContent,
  FileType,
  DocumentAccessType,
  SdrAssignment,
} = FilterType;

const { convertDateToAppliedFilterValue, getDateDisplayForDateRange } = DateUtil;

export const getMappedDataFromResponseForLeadsTableView = (response: LeadsTableViewContent) => {
  const additionalInfoData =
    response.additional_info && Object.keys(response.additional_info).length > 0
      ? (response.additional_info as {
          city?: string;
          country?: string;
          buyer_intent?: string;
          number_of_commissioned_employees?: number;
          phone?: string;
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
    phone: response.phone ?? additionalInfoData?.phone ?? '-',
    number_of_commissioned_employees: additionalInfoData?.number_of_commissioned_employees,
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
    buyer_intent_score: response.buyer_intent_score ?? '-',
    buyer_intent: response.buyer_intent ?? '-',
    bant_analysis: '-',
    user_message_count: `${response.user_message_count || 0}`,
    meeting_status: '-',
    product_of_interest: response.product_of_interest || '-',
    ip_address: response.ip_address || response.prospect_details?.ip_address || '-',
    session_id: response.session_id || '-',
    prospect_details: response?.prospect_details || {},
    company_details: response?.company_details || {},
    prospect_id: response?.prospect_id || null,
  };

  return mappedData;
};

export const getMappedDataFromResponseForVisitorsTableView = (
  response: VisitorsTableViewContent,
): VisitorsTableDisplayContent => {
  return {
    company: capitalizeString(response.company ?? response.company_demographics?.company_name ?? ''),
    name: response.name ?? response.prospect_demographics?.name ?? '',
    role: response.role ?? response.prospect_demographics?.role ?? '',
    website_url: response.company_demographics?.website_url ?? '',
    country: {
      city: response.prospect_demographics?.city || '-',
      country: response.prospect_demographics?.country || response.country || '-',
    } as LocationWithCityCountry,
    company_country: response.company_demographics?.company_country ?? '',
    industry_domain: capitalizeString(response.company_demographics?.industry_domain) ?? '',
    employee_count: NumberUtil.formatNumber(response.company_demographics?.employee_count ?? 0),
    revenue: NumberUtil.formatCurrencyWithDenominaton(response.company_demographics?.company_revenue ?? ''),
    email: response.email ?? response.prospect_demographics?.email ?? '',
    session_id: response.session_id ?? '',
    prospect_id: response.prospect_id ?? '',
    product_interest: response.product_interest ?? '',
    need: capitalizeString(response.need) ?? '',
    sdr_assignment: response.sdr_assignment ?? null,
    updated_on: response.updated_on ?? '',
  };
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
  const prospectLinkedInUrl = ensureProtocol(prospectDetails?.enriched_info?.linkedin_url || '');
  const companyLinkedInUrl = ensureProtocol(companyDetails?.linkedin_url || '');

  const transformedData: TransformedProspectAndCompanyDetailsContent = {
    prospect: {
      name: name || '-',
      email: email || '-',
      location: {
        city: prospectDetails?.city || '',
        country: prospectDetails?.country || (country as string) || '-',
      },
      enrichmentSource: prospectDetails?.enrichment_source || '',
      linkedInUrl: prospectLinkedInUrl,
    },
    company: {
      name: companyDetails?.company_name || company || '-',
      logoUrl: companyDetails?.website_url ? `${companyDetails?.website_url}/favicon.ico` : '',
      location: companyDetails?.company_country || (country as string) || '-',
      revenue: companyDetails?.company_revenue || '-',
      employees: companyDetails?.employee_count || '-',
      industry: companyDetails?.industry_domain || '-',
      domain: companyDetails?.website_url || '-',
      linkedInUrl: companyLinkedInUrl,
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
    case SdrAssignment:
      return {
        label: 'Assigned Rep',
        width: '334px',
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
    case DocumentAccessType:
      return {
        label: 'Document access type',
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
    case ProductInterest:
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

export const applySortingforFields = (
  sortState: SortValues | DataSourceSortValues,
  sortKeyToFieldMap: SortKeyToFieldMap,
  excludeFields?: string[],
) => {
  const sortApplied: SortItem[] = [];
  for (const [sortKey, field] of Object.entries(sortKeyToFieldMap)) {
    const order = (sortState as SortValues)[sortKey as keyof SortValues];
    if (order && !excludeFields?.includes(field)) sortApplied.push({ field, order });
  }
  return sortApplied;
};

export const getSortingAppliedValues = (sortState: SortValues | DataSourceSortValues, page: string) => {
  const isLeadsPage = page === LEADS_PAGE;
  const isLinkClicksPage = page === LINK_CLICKS_PAGE;
  const isMainTabPage =
    page === CONVERSATIONS_PAGE || page === LEADS_PAGE || page === LINK_CLICKS_PAGE || page === VISITORS_PAGE;
  const isWebpagesPage = page === WEBPAGES_PAGE;
  const isDocumentsPage = page === DOCUMENTS_PAGE;
  const isVideosPage = page === VIDEOS_PAGE;
  const isSlidesPage = page === SLIDES_PAGE;
  const isVisitorsPage = page === VISITORS_PAGE;
  const sortApplied: SortItem[] = [];
  const { timestampSort } = sortState as SortValues;

  if (isMainTabPage && timestampSort) {
    sortApplied.push({
      field: isLeadsPage || isLinkClicksPage || isVisitorsPage ? 'created_on' : 'timestamp',
      order: timestampSort ? timestampSort : 'desc',
    });
  }

  sortApplied.push(...applySortingforFields(sortState, SORT_KEY_TO_FIELD_MAP, ['timestamp']));

  if (isWebpagesPage) {
    sortApplied.push(...applySortingforFields(sortState, WEBPAGES_SORT_KEY_TO_FIELD_MAP));
  }

  if (isDocumentsPage) {
    sortApplied.push(...applySortingforFields(sortState, DOCUMENTS_SORT_KEY_TO_FIELD_MAP));
  }

  if (isVideosPage || isSlidesPage) {
    sortApplied.push(...applySortingforFields(sortState, ARTIFACTS_SORT_KEY_TO_FIELD_MAP));
  }

  if (isMainTabPage && sortApplied.length === 0) {
    sortApplied.push({
      field: isLeadsPage || isLinkClicksPage || isVisitorsPage ? 'created_on' : 'timestamp',
      order: 'desc',
    });
  }

  return sortApplied;
};

export const getSortValuesFromSortItems = (sortItems: SortItem[]): SortValues => {
  const sortValues: SortValues = INITIAL_SORT_VALUES;

  if (sortItems.length === 0) {
    sortValues.timestampSort = 'desc';
    return sortValues;
  }

  sortItems.forEach((item) => {
    const sortKey = FIELD_TO_SORT_KEY_MAP[item.field];
    if (sortKey) {
      (sortValues as SortValues)[sortKey] = item.order;
    }
  });

  // If no timestamp sort is set, default to the newest first
  if (!sortValues.timestampSort) {
    sortValues.timestampSort = 'desc';
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
    case VISITORS_PAGE:
      return VISITORS_TABLE_FILTERS_CONFIG;
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
  const isVisitorsPage = page === VISITORS_PAGE;

  const {
    dateRange,
    intentScore,
    location,
    productOfInterest,
    productInterest,
    // meetingBooked,
    userMessagesCount,
    company,
    testConversationsIncluded,
    sessionIdIncluded,
    sources,
    // usageCount,
    // duration,
    status,
    fileType,
    documentAccessType,
    sdrAssignment,
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
      field: 'page_type',
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

  if (productInterest.length > 0) {
    filterApplied.push({
      field: 'product_interest',
      value: productInterest,
      operator: 'in',
    });
  }

  if (isVisitorsPage) {
    filterApplied.push({
      field: 'company',
      value: null,
      operator: 'is_not_null',
    });

    if (sessionIdIncluded) {
      filterApplied.push({
        field: 'session_id',
        value: null,
        operator: 'is_not_null',
      });
    }

    if (sdrAssignment.length > 0) {
      filterApplied.push({
        field: 'sdr_assignment',
        value: sdrAssignment.map((item) => item?.id).filter((id): id is number => id != null),
        operator: 'in',
      });
    }

    // TODO: Uncomment when nested filter is implemented
    // if (meetingBooked) {
    //   filterApplied.push({
    //     field: 'meeting_form_submitted',
    //     value: meetingBooked, // e.g., 'all' or 'yes' or 'no'
    //     operator: 'eq',
    //   });
    // }
  }

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

  if (documentAccessType.length > 0) {
    filterApplied.push({
      field: 'access_type',
      value: documentAccessType,
      operator: 'in',
    });
  }

  // Default filter for videos page
  if (isVideosPage) {
    filterApplied.push({
      field: 'data_source_type',
      value: ['VIDEO', 'YOUTUBE', 'VIMEO', 'WISTIA'],
      operator: 'in',
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
  const appliedFilters: { key: string; label: string; value: string | string[] | boolean | SdrAssignment[] }[] = [];

  const {
    dateRange,
    intentScore,
    location,
    productOfInterest,
    productInterest,
    meetingBooked,
    userMessagesCount,
    company,
    testConversationsIncluded,
    sessionIdIncluded,
    sources,
    status,
    searchTableContent,
    usageCount,
    fileType,
    sdrAssignment,
    documentAccessType,
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

  if (sessionIdIncluded) {
    appliedFilters.push({
      key: SessionIdIncluded,
      label: 'Conversations',
      value: `${sessionIdIncluded}`,
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

  if (documentAccessType.length > 0) {
    appliedFilters.push({
      key: DocumentAccessType,
      label: 'Document access type',
      value: documentAccessType,
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

  if (sdrAssignment.length > 0) {
    appliedFilters.push({
      key: SdrAssignment,
      label: 'Assigned Rep',
      value: sdrAssignment,
    });
  }

  if (productInterest.length > 0) {
    appliedFilters.push({
      key: ProductInterest,
      label: 'Product',
      value: productInterest,
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

/**
 * Calculates session duration in seconds and total message count from chat history and conversation data
 */
export function calculateSessionMetrics(
  chatHistory: WebSocketMessage[],
  conversationData?: ConversationsTableDisplayContent | null,
): { sessionDurationInSeconds: number; totalMessageCount: number } {
  const isChatHistoryAvailable = chatHistory.length > 0;

  // Calculate session duration in seconds (exact, not rounded)
  let sessionDurationInSeconds = 0;
  if (isChatHistoryAvailable) {
    const firstMessage = new Date(chatHistory[0]?.timestamp as string);
    const lastMessage = new Date(chatHistory[chatHistory.length - 1]?.timestamp as string);
    sessionDurationInSeconds = (lastMessage.getTime() - firstMessage.getTime()) / 1000;
  }

  // Count messages
  const aiMessageCount = chatHistory.filter(
    (msg) => msg.role === 'ai' && (isStreamMessage(msg) || isTextMessage(msg)),
  ).length;
  const userMessageCount = conversationData ? Number(conversationData.user_message_count) : 0;
  const totalMessageCount = aiMessageCount + userMessageCount;

  return {
    sessionDurationInSeconds,
    totalMessageCount,
  };
}

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

  const highestIntentScore = sessionData?.buyer_intent_score ?? getHighestIntentScore(chatHistory).buyer_intent_score;

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
      case 'browsingHistorySummary':
        return {
          ...item,
          listValue: sessionData.browsing_analysis_summary || '-',
        };
      case 'assignRep':
        return {
          ...item,
          listValue: sessionData.sdr_assignment || '-',
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
      case 'parentUrl':
        return {
          ...item,
          listValue: sessionData.parent_url
            ? {
                itemLabel: sessionData.parent_url_title ?? new URL(sessionData.parent_url).hostname,
                itemValue: sessionData.parent_url,
              }
            : '-',
        };
      case 'entryPoint':
        return {
          ...item,
          listValue: toDisplayText(sessionData.agent_modal) || '-',
        };
      case 'ipAddress':
        return {
          ...item,
          listValue:
            sessionData.ip_address === '-'
              ? sessionData.company_details?.ip_address?.[0] || '-'
              : sessionData.ip_address,
        };
      case 'sessionDuration':
        return {
          ...item,
          listValue: `${sessionDuration} minutes`,
        };
      case 'trafficSource':
        return {
          ...item,
          listValue: isUrl(sessionData.query_params?.utm_source ?? '')
            ? new URL(sessionData.query_params?.utm_source ?? '').hostname
            : (sessionData.query_params?.utm_source ?? '-'),
        };
      case 'deviceType':
        return {
          ...item,
          listValue: toDisplayText(sessionData.device_type) || '-',
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
    itemValue:
      dataObject[item.itemKey as keyof TransformedProspectAndCompanyDetailsContent['prospect' | 'company']] ?? '',
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
      if (parent_column === key_name) {
        result[parent_column] = display_name;
      } else {
        (result[parent_column] as Record<string, string>)[key_name] = display_name;
      }
    } else {
      result[key_name] = display_name;
    }
  });

  return result;
};

export const transformEntityDataToColumnList = (inputArray: EntityMetadataResponseType) => {
  const result: string[] = Array.from(
    new Set(
      inputArray
        .filter((item) => item.is_display)
        .sort((a, b) => a.table_order - b.table_order)
        .map((item) => item.key_name),
    ),
  );

  return result;
};

export const transformEntityDataRelatedEntities = (inputArray: EntityMetadataResponseType) => {
  const result: Record<string, string[]> = inputArray
    .filter((item) => item.is_display)
    .reduce((acc, item) => {
      return {
        ...acc,
        [item.key_name]: item.related_entities.map(
          (relatedEntity) => inputArray.find((entity) => entity.id === Number(relatedEntity))?.key_name,
        ),
      };
    }, {});

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
  if (!integrationType) return 'Integration';
  return toDisplayText(integrationType);
};

export const getLeadTypeDisplayText = (leadType: string | undefined): string => {
  if (leadType === 'GOAL_ACHIEVED') {
    return 'URL clicked';
  } else if (leadType === 'GOAL_PRESENTED') {
    return 'URL presented';
  }

  return '-';
};

export function getHighestIntentScore(chatHistory: WebSocketMessage[]): {
  buyer_intent_score: number;
  buyer_intent: string;
} {
  if (!Array.isArray(chatHistory) || chatHistory.length === 0) {
    return {
      buyer_intent_score: 0,
      buyer_intent: '',
    };
  }
  const highestIntentScore = chatHistory.reduce(
    (
      maxScore: { buyer_intent_score: number; buyer_intent: string },
      msg: WebSocketMessage,
    ): { buyer_intent_score: number; buyer_intent: string } => {
      if (msg.message_type === 'EVENT' && msg.message?.event_type === 'MESSAGE_ANALYTICS') {
        const scoreRaw = (msg.message?.event_data as { buyer_intent_score?: number | string; buyer_intent?: string })
          ?.buyer_intent_score;
        const intent = (msg.message?.event_data as { buyer_intent_score?: number | string; buyer_intent?: string })
          ?.buyer_intent;
        const score = typeof scoreRaw === 'number' ? scoreRaw : Number(scoreRaw);
        return {
          buyer_intent_score: Math.max(maxScore.buyer_intent_score, isNaN(score) ? 0 : score),
          buyer_intent: intent || '',
        };
      }
      return {
        buyer_intent_score: maxScore.buyer_intent_score,
        buyer_intent: maxScore.buyer_intent,
      };
    },
    {
      buyer_intent_score: 0,
      buyer_intent: '',
    },
  );

  return {
    buyer_intent_score: highestIntentScore.buyer_intent_score,
    buyer_intent: highestIntentScore.buyer_intent,
  };
}

export const processDistributionData = <T extends DistributionItem>(
  data: T[],
  nameField: keyof T,
  groupingThreshold: number = 5,
  othersLabel: string = 'Other Items',
): PieChartDataItem[] => {
  const processedData = data.length > groupingThreshold ? data.slice(0, groupingThreshold) : data;
  const othersData = data.length > groupingThreshold ? data.slice(groupingThreshold) : [];

  const chartData: PieChartDataItem[] = processedData.map((item) => ({
    name: item[nameField] as string,
    value: item.count,
    percentage: item.percentage,
  }));

  if (othersData.length > 0) {
    const othersCount = othersData.reduce((sum, item) => sum + item.count, 0);
    const othersPercentage = othersData.reduce((sum, item) => sum + item.percentage, 0);

    chartData.push({
      name: othersLabel,
      value: othersCount,
      percentage: othersPercentage,
      groupedItems: othersData.map((item) => ({
        name: item[nameField] as string,
        value: item.count,
        percentage: item.percentage,
      })),
    });
  }

  return chartData;
};

export const normalizeSessionToConversationData = (
  sessionData?: SessionDetailsDataResponse,
): ConversationDetailsDataResponse => {
  if (!sessionData) {
    return {
      conversation: null,
      chat_history: [],
      feedback: [],
    };
  }

  // Transform SessionDetailsDataResponse to match ConversationDetailsDataResponse structure
  const { chat_history, chat_summary, prospect, session } = sessionData;

  const conversation = {
    session_id: session?.session_id || null,
    role: prospect?.role || null,
    timestamp: session?.start_time || null,
    email: prospect?.email || null,
    name: prospect?.name || null,
    company: prospect?.company || null,
    buyer_intent: null, // Not available in session data
    buyer_intent_score: session?.buyer_intent_score || null,
    user_message_count: 0, // Not available in session data
    product_of_interest: prospect?.product_interest || null,
    summary: chat_summary || null,
    parent_url: prospect?.parent_url || null,
    ip_address: prospect?.ip_address || session?.metadata?.ip_address || null,
    query_params: prospect?.query_params || null,
    prospect_details: {
      ip_address: prospect?.prospect_demographics?.ip_address || undefined,
      query_params: prospect?.query_params || undefined,
      loc: prospect?.prospect_demographics?.loc || undefined,
      city: prospect?.prospect_demographics?.city || undefined,
      region: prospect?.prospect_demographics?.region || undefined,
      country: prospect?.prospect_demographics?.country || undefined,
      timezone: prospect?.prospect_demographics?.timezone || undefined,
      enrichment_source: undefined,
      linkedin_url: undefined,
      enriched_info: undefined,
      role: prospect?.role || undefined,
      budget: prospect?.budget || undefined,
      timeline: prospect?.timeline || undefined,
      product_interest: prospect?.product_interest || undefined,
    },
    company_details: prospect?.company_demographics || {},
    budget: prospect?.budget || null,
    need: prospect?.need || null,
    timeline: prospect?.timeline || null,
    country: prospect?.country || prospect?.prospect_demographics?.country || null,
    device_type: session?.device_type || null,
    agent_modal: null, // Not available in session data
    parent_url_title: null, // Not available in session data
    browsing_analysis_summary: prospect.browsing_analysis_summary || null,
    is_test: session?.is_test || false,
    sdr_assignment: prospect.sdr_assignment || null,
    prospect_id: prospect.prospect_id || null,
  };

  return {
    conversation,
    chat_history: chat_history || [],
    feedback: [], // Initialize with empty array since it's optional
  };
};

export const checkFileSize = (file: File, maxFileSizeInBytes: number) => {
  if (maxFileSizeInBytes && file.size > maxFileSizeInBytes) {
    if (maxFileSizeInBytes >= ONE_MB_IN_BYTES) {
      // Display in MB if >= 1MB
      const maxSizeInMB = (maxFileSizeInBytes / ONE_MB_IN_BYTES).toFixed(2);
      const fileSizeInMB = (file.size / ONE_MB_IN_BYTES).toFixed(2);
      return {
        status: false,
        error: `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${maxSizeInMB}MB`,
      };
    } else {
      // Display in KB if < 1MB
      const maxSizeInKB = (maxFileSizeInBytes / 1024).toFixed(2);
      const fileSizeInKB = (file.size / 1024).toFixed(2);
      return {
        status: false,
        error: `File size (${fileSizeInKB}KB) exceeds the maximum allowed size of ${maxSizeInKB}KB`,
      };
    }
  }
  return {
    status: true,
    error: null,
  };
};

export const formatDurationToMinuteSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getValidTenantFromOrganizations = (
  organizations: OrganizationDetailsResponse[],
  tenantName: string | null,
) => {
  if (organizations.length === 1) {
    return organizations[0];
  } else if (organizations.length > 1) {
    return organizations.find((o) => o['tenant-name'] === tenantName) || organizations[0];
  }
  return null;
};
