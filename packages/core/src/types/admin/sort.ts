import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from "./admin";

export type SortCategory = "timestamp" | "sessionLength" | "intentScore";
export type PageType = LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE;

export type SortValues = {
  timestampSort: string | null;
  sessionLengthSort: string | null;
  intentScoreSort: string | null;
};

export interface SortFilterState {
  leads: SortValues;
  conversations: SortValues;
  setSortValue: (page: PageType, category: SortCategory, value: string) => void;
  resetPageSorts: (page: PageType) => void;
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
