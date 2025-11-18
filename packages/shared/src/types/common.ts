import { BrowsedUrl } from '@meaku/core/types/common';
import { CommandBarModuleType } from '@meaku/core/types/index';

export interface CommandBarSettings {
  tenant_id: string;
  agent_id: string;
  enabled?: boolean;
  message?: string;
  start_time?: string;
  end_time?: string;
  parent_url?: string;
  session_id?: string;
  prospect_id?: string;
  browsed_urls?: BrowsedUrl[];
  bc?: boolean;
  is_test?: boolean;
  is_admin?: boolean;
  query_params?: Record<string, string>;
  position?: string;
  root_zindex?: string;
  root_bottom_offset?: string;
  root_right_offset?: string;
  feedback_enabled?: boolean;
  active_module?: CommandBarModuleType;
}
