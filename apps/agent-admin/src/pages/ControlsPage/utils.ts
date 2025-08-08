import { Prompt } from '../../queries/query/usePrompts';
import { z } from 'zod';

export type CommonControlsProps = {
  title: string;
  promptType: string;
  textareaPlaceholder: string;
  exampleDescription: string;
  description: string;
  infoTitle: string;
};

export const CONTROLS_PAGE_HEADER_DESCRIPTION =
  'Set up your own rules to guide the assistant’s behavior. This field allows you to write specific instructions in plain English.';

export const ControlsTitleEnum = {
  AGENT_PERSONALITY: 'Agent Personality',
  INSTRUCTIONS: 'Instructions',
  AGENT_RESPONSE_WORD_COUNT: 'Agent Response Word Count',
  PRODUCT_DESCRIPTION: 'Product Description',
  SUPPORT: 'Support',
};

const { AGENT_PERSONALITY, INSTRUCTIONS, AGENT_RESPONSE_WORD_COUNT, PRODUCT_DESCRIPTION, SUPPORT } = ControlsTitleEnum;

export const CommonControls: CommonControlsProps[] = [
  {
    title: AGENT_PERSONALITY,
    promptType: 'trait',
    textareaPlaceholder: 'Describe how the assistant should interact with users…',
    exampleDescription: 'Act as a helpful and clear product expert who guides users with confidence and empathy.',
    description: `Guide your AI assistant's behavior and personality to optimize its interactions.`,
    infoTitle: 'Instruction for Agent Personality:',
  },
  {
    title: INSTRUCTIONS,
    promptType: 'directive',
    textareaPlaceholder: 'Type your custom instructions here…',
    exampleDescription:
      'If the user asks anything product-related, guide them to the most relevant feature using clear, concise language. Be helpful, not overwhelming.',
    description: CONTROLS_PAGE_HEADER_DESCRIPTION,
    infoTitle: 'General Instructions:',
  },
  {
    title: AGENT_RESPONSE_WORD_COUNT,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `Select the style of agent responses. Brief, standard or detailed.`,
    infoTitle: '',
  },
  {
    title: PRODUCT_DESCRIPTION,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `Add a list of your products along with short descriptions. This helps the agent understand what each product does and tailor the conversation accordingly.`,
    infoTitle: '',
  },
  {
    title: SUPPORT,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `Set a default message to guide users when they have support-related questions. You can include an email address, a link to a help page, or both. This message will be shown when users ask for help or support.`,
    infoTitle: '',
  },
];

export const getFilterAppliedValues = (promptType: string, agentId: number) => {
  return [
    {
      field: 'prompt_type',
      operator: 'eq',
      value: promptType,
    },
    {
      field: 'agent_function',
      operator: 'eq',
      value: 'response_generation',
    },
    {
      field: 'base_prompt',
      operator: 'eq',
      value: null,
    },
    {
      field: 'agent_id',
      operator: 'eq',
      value: agentId,
    },
  ];
};

export const getSortedPrompts = (prompts: Prompt[]) => {
  return [...prompts]?.sort((a, b) => {
    if (!a.created_on || !b.created_on) return 0;
    return new Date(a.created_on).getTime() - new Date(b.created_on).getTime();
  });
};

export const SUPPORT_CONFIG = [
  {
    label: 'Website URL',
    id: 'website_url',
    placeholder: 'Enter a link to your help page or support website',
  },
  {
    label: 'Email',
    id: 'email',
    placeholder: 'Enter a support email address',
  },
  {
    label: 'Phone',
    id: 'phone',
    placeholder: 'Enter a phone number for support',
  },
];

// Zod schema for form validation - this creates a dynamic schema based on checked fields
export const createSupportFormSchema = (checkedFields: { email: boolean; phone: boolean; website_url: boolean }) => {
  return z.object({
    email: checkedFields.email
      ? z
          .string()
          .min(1, 'Email is required')
          .refine(
            (val) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(val);
            },
            { message: 'Please enter a valid email address' },
          )
      : z.string().optional(),
    phone: checkedFields.phone
      ? z
          .string()
          .min(1, 'Phone is required')
          .refine(
            (val) => {
              // Remove all non-digit characters for validation
              const digitsOnly = val.replace(/\D/g, '');

              // Check if it has at least 10 digits and not more than 12
              if (digitsOnly.length < 10 || digitsOnly.length > 12) {
                return false;
              }

              // Basic format validation for common patterns
              const phoneRegex = /^(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
              return phoneRegex.test(val);
            },
            { message: 'Please enter a valid phone number format (e.g. +1 (855) 789-4433 or 7878456123)' },
          )
      : z.string().optional(),
    website_url: checkedFields.website_url
      ? z
          .string()
          .min(1, 'Website URL is required')
          .refine(
            (val) => {
              try {
                // Check if it's a valid URL
                const url = new URL(val.startsWith('http') ? val : `https://${val}`);

                // Additional checks for website URLs
                if (!url.hostname || url.hostname.length < 3) {
                  return false;
                }

                // Check for common TLDs or at least a dot in the hostname
                if (!url.hostname.includes('.')) {
                  return false;
                }

                return true;
              } catch {
                return false;
              }
            },
            { message: 'Please enter a valid website URL' },
          )
      : z.string().optional(),
  });
};

export type SupportFormData = {
  email: string;
  phone: string;
  website_url: string;
};

// Product Description constants and types
export type ProductDescriptionData = {
  name: string;
  description: string;
};

export const PRODUCT_DESCRIPTION_INITIAL_DATA: ProductDescriptionData[] = [
  {
    name: '',
    description: '',
  },
];

// Zod schema for product description validation
export const productDescriptionSchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .superRefine((data, ctx) => {
    const nameTrimmed = data.name.trim();
    const descTrimmed = data.description.trim();

    // Only validate if at least one field is not empty
    if (nameTrimmed.length > 0 || descTrimmed.length > 0) {
      if (nameTrimmed.length === 0) {
        ctx.addIssue({
          path: ['name'],
          message: 'Product name is required.',
          code: z.ZodIssueCode.custom,
        });
      } else if (nameTrimmed.length < 2) {
        ctx.addIssue({
          path: ['name'],
          message: 'Product name must be at least 2 characters.',
          code: z.ZodIssueCode.custom,
        });
      }

      if (descTrimmed.length === 0) {
        ctx.addIssue({
          path: ['description'],
          message: 'Product description is required.',
          code: z.ZodIssueCode.custom,
        });
      } else if (descTrimmed.length < 10) {
        ctx.addIssue({
          path: ['description'],
          message: 'Product description must be at least 10 characters.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const productFormSchema = z.object({
  products: z.array(productDescriptionSchema),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
