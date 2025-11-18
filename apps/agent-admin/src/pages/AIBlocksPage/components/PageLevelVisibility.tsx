import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ColumnConfig, ConfigurationData, ConfigurationFormData } from '../../../components/ConfigurationTable/utils';
import BrandingSectionContainer from '../../../pages/BrandingPage/BrandingSectionContainer';
import ConfigurationTable from '../../../components/ConfigurationTable';
import { useMemo, useEffect } from 'react';
import Input from '@breakout/design-system/components/layout/input';
import { UseFormReturn } from 'react-hook-form';

// Zod schema for product description validation
export const pageVisibilitySchema = z
  .object({
    visibility_rules: z.string(),
    page_url: z.string(),
  })
  .superRefine((data, ctx) => {
    const visibilityRulesTrimmed = data.visibility_rules.trim();
    const pageUrlTrimmed = data.page_url.trim();

    // Only validate if at least one field is not empty
    if (pageUrlTrimmed.length > 0) {
      if (visibilityRulesTrimmed.length === 0) {
        ctx.addIssue({
          path: ['visibility_rules'],
          message: 'Rule is required.',
          code: z.ZodIssueCode.custom,
        });
      }

      if (pageUrlTrimmed.length === 0) {
        ctx.addIssue({
          path: ['page_url'],
          message: 'URL is required.',
          code: z.ZodIssueCode.custom,
        });
      }

      // Apply different validation based on the rule type
      if (visibilityRulesTrimmed === 'exact') {
        // For exact, validate that it's a proper URL
        try {
          const url = new URL(pageUrlTrimmed);

          // Check if protocol is http or https
          if (!['http:', 'https:'].includes(url.protocol)) {
            ctx.addIssue({
              path: ['page_url'],
              message: 'Please start your URL with https:// or http://',
              code: z.ZodIssueCode.custom,
            });
          }

          // Strict hostname validation
          const hostnameParts = url.hostname.split('.');

          // Must have at least 2 parts (domain + TLD), e.g., example.com
          if (hostnameParts.length < 2) {
            ctx.addIssue({
              path: ['page_url'],
              message: 'Please enter a complete website address (e.g., example.com)',
              code: z.ZodIssueCode.custom,
            });
          }

          // TLD (last part) must be 2-6 characters and only letters (covers 99% of real TLDs)
          const tld = hostnameParts[hostnameParts.length - 1];
          if (tld.length < 2 || tld.length > 6) {
            ctx.addIssue({
              path: ['page_url'],
              message: 'Please enter a valid website address ending with .com, .org, .io, etc.',
              code: z.ZodIssueCode.custom,
            });
          }

          // TLD should only contain letters (no numbers or hyphens)
          if (!/^[a-zA-Z]+$/.test(tld)) {
            ctx.addIssue({
              path: ['page_url'],
              message: 'Website address must end with a valid extension like .com, .org, or .net',
              code: z.ZodIssueCode.custom,
            });
          }

          // For better validation, require at least 3 parts if there's a subdomain (e.g., www.example.com)
          // This catches incomplete URLs like "www.hacker" or "www.hackerear"
          if (hostnameParts.length === 2) {
            const firstPart = hostnameParts[0];
            // If first part looks like a common subdomain (www, app, api, etc.), suggest adding more parts
            if (['www', 'app', 'api', 'web', 'mail', 'dev', 'staging'].includes(firstPart.toLowerCase())) {
              ctx.addIssue({
                path: ['page_url'],
                message: `This URL looks incomplete. Try something like https://${firstPart}.example.com`,
                code: z.ZodIssueCode.custom,
              });
            }
          }

          // All parts must be non-empty and valid (contain alphanumeric chars)
          const invalidPart = hostnameParts.some((part) => {
            return part.length === 0 || !/^[a-zA-Z0-9-]+$/.test(part);
          });

          if (invalidPart) {
            ctx.addIssue({
              path: ['page_url'],
              message: 'Please enter a valid website address without special characters',
              code: z.ZodIssueCode.custom,
            });
          }
        } catch {
          ctx.addIssue({
            path: ['page_url'],
            message: 'Please enter a complete website URL (e.g., https://www.example.com)',
            code: z.ZodIssueCode.custom,
          });
        }
      }
      // For 'contains' and 'exclude' rules, we only need non-empty string validation
      // which is already handled by the length check above
    }
  });

const formSchema = z.object({
  items: z.array(pageVisibilitySchema),
});

type FormData = z.infer<typeof formSchema>;

export interface PageVisibilityItem {
  visibility_rules: string;
  page_url: string;
}

interface PageLevelVisibilityProps {
  data?: PageVisibilityItem[];
  /** @deprecated onChange is not used anymore. State updates happen via props after successful API calls. */
  onChange?: (data: PageVisibilityItem[]) => void;
  onSave?: (data?: { pageVisibilityRules: PageVisibilityItem[] }) => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * PageLevelVisibility - Manages page-level visibility rules
 *
 * Accepts data as props and syncs with it via useEffect.
 * On save, calls onSave with the form data.
 * State updates only happen after successful API call via props change.
 * If API fails, form retains user input for correction.
 */
const PageLevelVisibility = ({
  data = [],
  onChange: _onChange, // Deprecated - kept for backward compatibility but not used
  onSave,
  isLoading = false,
  disabled = false,
}: PageLevelVisibilityProps) => {
  // Initialize form for ConfigurationTable
  const form = useForm<FormData>({
    // @ts-ignore - Type instantiation is excessively deep and possibly infinite.
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: data.length > 0 ? data : [{ visibility_rules: 'contains', page_url: '' }],
    },
    mode: 'onTouched',
  });

  // Update form when data prop changes
  useEffect(() => {
    form.reset({
      items: data.length > 0 ? data : [{ visibility_rules: 'contains', page_url: '' }],
    });
  }, [data, form]);

  // Define columns for the table - memoized to prevent infinite loops
  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        key: 'visibility_rules',
        label: 'Visibility Rules',
        fieldType: 'dropdown',
        placeholder: 'Select Rule',
        dropdownOptions: [
          {
            label: 'Contains',
            value: 'contains',
          },
          {
            label: 'Exact match',
            value: 'exact',
          },
          {
            label: 'Exclude',
            value: 'exclude',
          },
        ],
        gridSpan: 5,
      },
      {
        key: 'page_url',
        label: 'URL',
        fieldType: 'custom',
        customRenderer: ({ field }) => (
          <Input
            className="h-full w-full rounded-none border-none p-0 pl-1 font-medium text-blue_sec-1000 placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-0"
            {...field}
            placeholder="Enter page URL"
            disabled={disabled || isLoading}
          />
        ),
        placeholder: 'Enter page URL',
        gridSpan: 6,
      },
    ],
    [disabled, isLoading],
  );

  const handleSave = async (configData: ConfigurationData[]) => {
    // Convert ConfigurationData to PageVisibilityItem
    const visibilityData = configData.map((item) => ({
      visibility_rules: item.visibility_rules as string,
      page_url: item.page_url as string,
    }));

    // DO NOT update parent state here (optimistic update)
    // State will be updated only after successful API call via useEffect
    // when block data is refetched and the data prop changes

    // Pass fresh data directly to onSave for API call
    // IMPORTANT: Await the onSave call so errors propagate to ConfigurationTable
    // This ensures local state only updates if API succeeds
    await onSave?.({ pageVisibilityRules: visibilityData });
  };

  // Convert data to ConfigurationData format for the table
  const tableData = useMemo(() => {
    return data.map((item) => ({
      visibility_rules: item.visibility_rules,
      page_url: item.page_url,
    })) as ConfigurationData[];
  }, [data]);

  return (
    <BrandingSectionContainer>
      <ConfigurationTable
        title="Page-Level Visibility"
        description="Define the pages where you want this block to be visible."
        data={tableData}
        isLoading={isLoading}
        error={null}
        columns={columns}
        onSave={handleSave}
        addDefaultRow={[{ visibility_rules: 'contains', page_url: '' }]}
        form={form as unknown as UseFormReturn<ConfigurationFormData>}
        formFieldName="items"
        showVisibilityRulesCard
      />
    </BrandingSectionContainer>
  );
};

export default PageLevelVisibility;
