import { EntityMetadataColumn } from '../types';
import { getCompanyLogoSrc } from '@meaku/core/utils/index';

/**
 * Related metadata gathered for a specific column
 */
export interface RelatedMetadata {
  /** Logo URL computed from LOGO relation fields */
  logo?: string;
  /** Tooltip text from TOOLTIP relation */
  tooltip?: string;
  /** Link URL from LINK relation */
  link?: string;
  /** Email address from EMAIL relation */
  email?: string;
  /** Raw metadata fields for advanced use cases */
  rawMetadata?: Record<string, unknown>;
}

/**
 * Get value from nested object using dot notation path with fallback support
 * Supports multiple fallback keys separated by ':'
 *
 * Examples:
 * - "email" -> row.email
 * - "company.name" -> row.company.name (nested)
 * - "email:details.website_url" -> tries row.email first, then row.details.website_url
 * - "name:company.name:details.company_name" -> tries multiple fallbacks in order
 */
export const getValueFromDataLookup = (
  row: Record<string, unknown>,
  dataLookup: string | null | undefined,
): unknown => {
  if (!dataLookup) return null;

  // Split by ':' to get fallback keys
  const fallbackKeys = dataLookup.split(':');

  // Try each fallback key in order
  for (const lookupKey of fallbackKeys) {
    const trimmedKey = lookupKey.trim();
    if (!trimmedKey) continue;

    // Split by '.' for nested path access
    const path = trimmedKey.split('.');
    let value: unknown = row;

    // Traverse the path
    let pathValid = true;
    for (const key of path) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[key];
      } else {
        pathValid = false;
        break;
      }
    }

    // If we found a valid non-null/non-undefined value, return it
    if (pathValid && value !== null && value !== undefined) {
      return value;
    }
  }

  // No valid value found in any fallback
  return null;
};

/**
 * Gather all related metadata for a specific column
 * This is the core function that processes meta_reference_column and meta_reference_relation
 */
export const gatherRelatedMetadata = (
  column: EntityMetadataColumn,
  row: Record<string, unknown>,
  allColumns: EntityMetadataColumn[],
): RelatedMetadata => {
  const metadata: RelatedMetadata = {};

  // Find all columns that reference this column
  const relatedColumns = allColumns.filter((col) => col.meta_reference_column === column.column_name);

  // Process each related column based on its relation type
  for (const relatedCol of relatedColumns) {
    const relatedValue = getValueFromDataLookup(row, relatedCol.data_lookup);

    switch (relatedCol.meta_reference_relation) {
      case 'LOGO':
        // For LOGO relations, generate logo URL using Brandfetch
        if (!metadata.logo && relatedValue && typeof relatedValue === 'string') {
          try {
            metadata.logo = getCompanyLogoSrc(relatedValue);
          } catch {
            // Silently handle logo generation errors
          }
        }
        break;

      case 'TOOLTIP':
        if (relatedValue && typeof relatedValue === 'string') {
          metadata.tooltip = relatedValue;
        }
        break;

      case 'LINK':
        if (relatedValue && typeof relatedValue === 'string') {
          metadata.link = relatedValue;
        }
        break;

      case 'EMAIL':
        if (relatedValue && typeof relatedValue === 'string') {
          metadata.email = relatedValue;
        }
        break;

      case 'NONE':
      default:
        // Store raw metadata for potential future use
        if (!metadata.rawMetadata) {
          metadata.rawMetadata = {};
        }
        metadata.rawMetadata[relatedCol.key_name] = relatedValue;
        break;
    }
  }

  return metadata;
};

/**
 * Get primary value for a column using its data_lookup path
 */
export const getPrimaryValue = (column: EntityMetadataColumn, row: Record<string, unknown>): unknown => {
  // If data_lookup is provided, use it
  if (column.data_lookup) {
    return getValueFromDataLookup(row, column.data_lookup);
  }

  // Fallback to key_name if no data_lookup
  return row[column.key_name];
};
