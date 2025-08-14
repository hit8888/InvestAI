import { BrowsedUrl } from '../common';

export type UpdateProspectPayload = {
  name?: string;
  email?: string;
  external_id?: string;
  prospect_demographics?: unknown;
  origin?: 'WEB_FORM' | 'LINK_CLICK';
  browsed_urls?: BrowsedUrl[];
};
