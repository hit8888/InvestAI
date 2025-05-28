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

export type SortValues = {
  timestampSort: string | null;
  sessionLengthSort: string | null;
  intentScoreSort: string | null;
};

export type CommonSortValues = {
  updated_onSort: boolean;
  statusSort: boolean;
};

export type WebpagesSortValues = CommonSortValues & {
  urlSort: boolean;
  titleSort: boolean;
};

export type DocumentsSortValues = CommonSortValues & {
  nameSort: boolean;
  data_source_typeSort: boolean;
};

export type ArtifactsSortValues = CommonSortValues & {
  assetSort: boolean;
  dataSort: boolean;
};

export interface SortFilterState {
  leads: SortValues;
  conversations: SortValues;
  webpages: WebpagesSortValues;
  documents: DocumentsSortValues;
  videos: ArtifactsSortValues;
  slides: ArtifactsSortValues;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | boolean) => void;
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
