import { PaginationPageType } from './admin';

export type SortCategory = 'timestamp' | 'sessionLength' | 'intentScore';

export type SortValues = {
  timestampSort: string | null;
  sessionLengthSort: string | null;
  intentScoreSort: string | null;
};

export interface SortFilterState {
  leads: SortValues;
  conversations: SortValues;
  webpages: SortValues;
  documents: SortValues;
  videos: SortValues;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string) => void;
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
