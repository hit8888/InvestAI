import { PaginationPageType } from './admin';

export type SortCategory =
  | 'timestamp'
  | 'timeline'
  | 'user_message_count'
  | 'buyer_intent'
  | 'session_id'
  | 'name'
  | 'email'
  | 'role'
  | 'country'
  | 'company'
  | 'product_interest'
  | 'product_of_interest'
  | 'assigned_user_email'
  | 'ip_address'
  | 'lead_type'
  | 'updated_on'
  | 'status'
  | 'data_source_type'
  | 'url'
  | 'name'
  | 'title'
  | 'source_url'
  | 'asset'
  | 'data';

export type SortOrder = 'asc' | 'desc' | null;

export type SortValues = {
  timestampSort: SortOrder;
  timelineSort: SortOrder;
  user_message_countSort: SortOrder;
  buyer_intentSort: SortOrder;
  session_idSort: SortOrder;
  nameSort: SortOrder;
  emailSort: SortOrder;
  roleSort: SortOrder;
  countrySort: SortOrder;
  companySort: SortOrder;
  product_interestSort: SortOrder;
  assigned_user_emailSort: SortOrder;
  ip_addressSort: SortOrder;
  lead_typeSort: SortOrder;
  product_of_interestSort: SortOrder;
};

export type CommonSortValues = {
  updated_onSort: SortOrder;
  statusSort: SortOrder;
};

export type WebpagesSortValues = CommonSortValues & {
  urlSort: SortOrder;
  titleSort: SortOrder;
};

export type DocumentsSortValues = CommonSortValues & {
  source_nameSort: SortOrder;
  data_source_typeSort: SortOrder;
  descriptionSort: SortOrder;
};

export type ArtifactsSortValues = CommonSortValues & {
  assetSort: SortOrder;
  descriptionSort: SortOrder;
};

export type DataSourceSortValues = WebpagesSortValues | DocumentsSortValues | ArtifactsSortValues;

export type SortKeyToFieldMap =
  | Record<keyof SortValues, string>
  | Record<keyof WebpagesSortValues, string>
  | Record<keyof DocumentsSortValues, string>
  | Record<keyof ArtifactsSortValues, string>;

export interface SortFilterState {
  leads: SortValues;
  'link-clicks': SortValues;
  conversations: SortValues;
  prospects: SortValues;
  webpages: WebpagesSortValues;
  documents: DocumentsSortValues;
  videos: ArtifactsSortValues;
  slides: ArtifactsSortValues;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | SortOrder) => void;
  resetPageSorts: (page: PaginationPageType) => void;
  initializeSortValues: (page: PaginationPageType, sortValues: SortValues) => void;
}

export interface SortFilterConfig {
  category: SortCategory;
  headerLabel: string;
  radioOptions: Array<{
    label: string;
    value: string;
  }>;
  stateKey: keyof SortValues;
}
