import { z } from 'zod';
import { EntryPointAlignmentSchema } from '../entryPoint';

export const CTAConfigSchema = z
  .object({
    text: z.string().nullish(),
    url: z.string().nullish(),
    message: z.string().nullish(),
  })
  .nullish();

export const BottomBarConfigSchema = z.object({
  primary_placeholder: z.string().or(z.array(z.string())),
  secondary_placeholder: z.string().or(z.array(z.string())),
});

export const CommandBarModuleTypeSchema = z.enum([
  'ASK_AI',
  'LIVE_CHAT',
  'SUMMARIZE',
  'BOOK_MEETING',
  'VIDEO_LIBRARY',
  'IFRAME',
]);

export const CommandBarPositionSchema = z.enum(['center_right', 'center_left', 'bottom_right', 'bottom_left']);

export const NudgeAssetAlignmentSchema = z.enum(['TOP', 'BOTTOM']);

export const NudgeAssetTypeSchema = z.enum(['VIDEO', 'IMAGE']);

export const NudgeCtaSchema = z.object({
  text: z.string(),
  action: z.string(),
  metadata: z.object({
    event_data: z.object({
      content: z.string(),
    }),
  }),
});

export const NudgeAssetSchema = z.object({
  display_text: z.string(),
  asset_url: z.string(),
  asset_type: NudgeAssetTypeSchema,
  alignment: NudgeAssetAlignmentSchema,
  asset_preview_url: z.string(),
});

export const NudgeSchema = z.object({
  id: z.string(),
  header_text: z.string(),
  main_body_text: z.string(),
  footer_text: z.string(),
  footer_metadata: z.record(z.string(), z.unknown()),
  associated_module: CommandBarModuleTypeSchema,
  display_duration: z.number(),
  ctas: z.array(NudgeCtaSchema),
  assets: z.array(NudgeAssetSchema),
});

export const NudgeResponseSchema = z.object({
  status: z.string(),
  nudge: NudgeSchema,
});

export const CommandBarModuleConfigSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  module_type: CommandBarModuleTypeSchema,
  tooltip_text: z.string(),
  base_priority: z.number(),
  module_configs: z.record(z.string(), z.any()),
});

export const NudgeConfigSchema = z.object({
  polling_enabled: z.boolean(),
  polling_start_delay_ms: z.number(),
  polling_frequency_ms: z.number(),
  max_polling_count: z.number(),
});

export const CommandBarConfigSchema = z.object({
  enabled: z.boolean(),
  ui: z.object({
    position: CommandBarPositionSchema,
  }),
  dynamic_config_start_delay_ms: z.number(),
  modules: z.array(CommandBarModuleConfigSchema),
  nudge: NudgeConfigSchema,
  nudge_data: NudgeSchema.nullable(),
});

export const ConfigurationBodySchema = z.object({
  default_error_message: z.string(),
  welcome_message: z.object({
    message: z.string(),
    suggested_questions: z.array(z.string()),
    bounce_message: z.boolean(),
    default_artifact_url: z.string().nullable(),
  }),
  bottom_bar_config: BottomBarConfigSchema.optional(),
  disclaimer_message: z.string().optional(),
  show_cta: z.boolean().optional(),
  cta_config: CTAConfigSchema,
});

export const BannerConfigSchema = z.object({
  show_banner: z.boolean().optional(),
  header: z.string().optional().nullish(),
  subheader: z.string().optional().nullish(),
  show_at: z.number().optional().nullish(),
  hide_after: z.number().optional().nullish(),
});

export const OrbConfigSchema = z.object({
  show_orb: z.boolean().optional().nullable(),
  logo_url: z.string().optional().nullable(),
});

export const TrackingConfigSchema = z.object({
  element_selectors: z.array(z.string()),
  track_clicks: z.boolean().optional(),
  track_form_submissions: z.boolean().optional(),
});

export const ConfigurationSchema = z.object({
  agent_id: z.number(),
  agent_name: z.string(),
  org_name: z.string(),
  is_enabled: z.boolean(),
  logo: z.string().nullable(),
  cover_image: z.string().nullable().optional(),
  header: z.object({
    title: z.string().nullable(),
    sub_title: z.string().nullable(),
  }),
  body: ConfigurationBodySchema,
  style_config: z.object({
    entry_point_alignment: EntryPointAlignmentSchema.optional(),
    entry_point_alignment_mobile: EntryPointAlignmentSchema.optional(),
    invert_text_color: z.boolean().optional(),
    shadow_enabled: z.boolean().optional(), // TODO: remove this field from the response when backend is updated
    primary: z.string().optional(),
    primary_foreground: z.string().optional(),
    primary_text: z.string().optional(),
    secondary: z.string().optional(),
    secondary_foreground: z.string().optional(),
    card: z.string().optional(),
    card_foreground: z.string().optional(),
    banner_config: BannerConfigSchema.optional().nullish(),
    orb_config: OrbConfigSchema.optional(),
    font_config: z
      .object({
        font_family: z.string(),
        font_url: z.string(),
      })
      .optional(),
  }),
  tracking_config: TrackingConfigSchema.optional(),
  whitelisted_domains: z.array(z.string()),
  experiment_tag: z.string().optional().nullable(),
  command_bar: CommandBarConfigSchema.optional().nullable(),
  session_id: z.string().optional(),
  prospect_id: z.string().optional(),
});

export type CTAConfigType = z.infer<typeof CTAConfigSchema>;

export type BottomBarType = z.infer<typeof BottomBarConfigSchema>;

export type BannerConfigType = z.infer<typeof BannerConfigSchema>;

export type OrbConfigType = z.infer<typeof OrbConfigSchema>;

export type ConfigurationApiResponse = z.infer<typeof ConfigurationSchema>;

export type ConfigurationBodyApiResponse = z.infer<typeof ConfigurationBodySchema>;

export type CommandBarModuleConfigType = z.infer<typeof CommandBarModuleConfigSchema>;

export type NudgeConfigType = z.infer<typeof NudgeConfigSchema>;

export type NudgeResponse = z.infer<typeof NudgeResponseSchema>;

export type Nudge = z.infer<typeof NudgeSchema>;

export type Cta = z.infer<typeof NudgeCtaSchema>;

export type Asset = z.infer<typeof NudgeAssetSchema>;

export type AssetType = z.infer<typeof NudgeAssetTypeSchema>;

export type AssetAlignment = z.infer<typeof NudgeAssetAlignmentSchema>;

export type CommandBarModuleType = z.infer<typeof CommandBarModuleTypeSchema>;

export type CommandBarPosition = z.infer<typeof CommandBarPositionSchema>;

export type TrackingConfigType = z.infer<typeof TrackingConfigSchema>;
