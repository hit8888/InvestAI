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

export const ConfigurationSchema = z.object({
  agent_id: z.number(),
  agent_name: z.string(),
  org_name: z.string(),
  logo: z.string().nullable(),
  header: z.object({
    title: z.string().nullable(),
    sub_title: z.string().nullable(),
  }),
  body: ConfigurationBodySchema,
  style_config: z.object({
    entry_point_alignment: EntryPointAlignmentSchema.optional(),
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
  tracking_config: z
    .object({
      element_selectors: z.array(z.string()),
      track_clicks: z.boolean().optional(),
      track_form_submissions: z.boolean().optional(),
    })
    .optional(),
  whitelisted_domains: z.array(z.string()),
  experiment_tag: z.string().optional().nullable(),
});

export type CTAConfigType = z.infer<typeof CTAConfigSchema>;

export type BottomBarType = z.infer<typeof BottomBarConfigSchema>;

export type BannerConfigType = z.infer<typeof BannerConfigSchema>;

export type OrbConfigType = z.infer<typeof OrbConfigSchema>;

export type ConfigurationApiResponse = z.infer<typeof ConfigurationSchema>;

export type ConfigurationBodyApiResponse = z.infer<typeof ConfigurationBodySchema>;
