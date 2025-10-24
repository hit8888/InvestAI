/**
 * Reusable types for Block Preview Components
 *
 * This file defines common interfaces used across all block preview components
 * to ensure consistent data flow from content sections to preview sections.
 */

/**
 * Base props that all block preview components should accept
 * These correspond to the fields in BlockVisibilityData
 */
export interface BaseBlockPreviewProps {
  /** Block description - displayed in the preview description section */
  description?: string;
  /** Block icon URL - displayed in the preview header */
  iconUrl?: string;
  /** Block header text - defaults to title if not provided */
  headerText?: string;
  /** CTA button label - customizable per block type */
  ctaLabel?: string;
}

/**
 * Extended preview props for blocks with module-specific configuration
 * Generic type T allows each block to define its own module config type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExtendedBlockPreviewProps<T = Record<string, any>> extends BaseBlockPreviewProps {
  /** Module-specific configuration data */
  moduleConfig?: T;
}

/**
 * Example: Ask AI module-specific config
 */
export interface AskAIModuleConfig {
  avatar: string;
  cover_image: string;
  name: string;
  introduction: string;
}

/**
 * Utility function to merge block visibility data with preview defaults
 * This ensures preview always has fallback values
 */
export const getPreviewProps = (
  blockVisibilityData: { description?: string; iconUrl?: string },
  defaults: BaseBlockPreviewProps,
): BaseBlockPreviewProps => {
  return {
    description: blockVisibilityData.description || defaults.description || '',
    iconUrl: blockVisibilityData.iconUrl || defaults.iconUrl || '',
    headerText: defaults.headerText || '',
    ctaLabel: defaults.ctaLabel || 'Submit',
  };
};
