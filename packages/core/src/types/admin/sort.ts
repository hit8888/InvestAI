import { PaginationPageType } from './admin';

export type SortCategory =
  | 'timestamp'
  | 'sessionLength'
  | 'intentScore'
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
  timestampSort: string | null;
  sessionLengthSort: string | null;
  intentScoreSort: string | null;
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

export interface SortFilterState {
  leads: SortValues;
  conversations: SortValues;
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
