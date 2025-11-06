import { BrowsedUrl } from '../common';

export type ConfigPayload = {
  parent_url?: string;
  session_id?: string;
  prospect_id?: string;
  nudge_disabled?: boolean;
  browsed_urls?: BrowsedUrl[];
  query_params?: Record<string, string>;
  is_test?: boolean;
};
