import { z } from 'zod';
import type { TablePageConfig } from '../types';

/**
 * Zod schema for table page configuration
 */
const tablePageConfigSchema = z.object({
  pageKey: z.string().min(1, 'Page key is required'),
  pageTitle: z.string().min(1, 'Page title is required'),

  api: z.object({
    tableData: z.string().min(1, 'Table data endpoint is required'),
    entityMetadata: z.string().min(1, 'Entity metadata endpoint is required'),
    filterConfig: z.string().optional(),
  }),

  pagination: z.object({
    defaultPageSize: z.number().positive('Default page size must be positive'),
    pageSizeOptions: z.array(z.number().positive()).min(1, 'At least one page size option required'),
  }),

  defaultSort: z
    .object({
      field: z.string(),
      order: z.enum(['asc', 'desc']),
    })
    .optional(),

  filters: z.array(z.any()).optional(),

  drawer: z.object({
    enabled: z.boolean(),
    width: z.string(),
    component: z.any(), // React component
    urlParam: z.string(),
  }),

  emptyState: z.any().optional(),
  loadingState: z.any().optional(),
  errorState: z.any().optional(),
});

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate table page configuration
 */
export const validateTableConfig = (config: TablePageConfig): ValidationResult => {
  try {
    tablePageConfigSchema.parse(config);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return {
        valid: false,
        error: errorMessages,
      };
    }
    return {
      valid: false,
      error: 'Unknown validation error',
    };
  }
};
