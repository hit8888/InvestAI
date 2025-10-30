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
  AGENT_PERSONALITY: 'Personality',
  INSTRUCTIONS: 'Instructions',
  AGENT_RESPONSE_LENGTH: 'Response Length',
  PRODUCT_DESCRIPTION: 'Product Description',
  SUPPORT: 'Support',
  IDEAL_CUSTOMER_PERSONA: 'Ideal Customer Persona',
  IDEAL_COMPANY_PERSONA: 'Ideal Company Persona',
};

const {
  AGENT_PERSONALITY,
  INSTRUCTIONS,
  AGENT_RESPONSE_LENGTH,
  PRODUCT_DESCRIPTION,
  SUPPORT,
  IDEAL_CUSTOMER_PERSONA,
  IDEAL_COMPANY_PERSONA,
} = ControlsTitleEnum;

export const CommonControls: CommonControlsProps[] = [
  {
    title: AGENT_PERSONALITY,
    promptType: 'trait',
    textareaPlaceholder: 'Describe how the assistant should interact with users…',
    exampleDescription: 'Act as a helpful and clear product expert who guides users with confidence and empathy.',
    description: `Define how you want your agent's personality to be. You want them to be casual or formal, fun or serious etc.`,
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
    title: AGENT_RESPONSE_LENGTH,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `Define the ideal length for the AI assistant's responses. Use this to control conciseness or provide more detailed answers.`,
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
    title: IDEAL_CUSTOMER_PERSONA,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `ICP is the profile of customers you would like to target, helping SDRs target and engage high-quality leads.`,
    infoTitle: '',
  },
  {
    title: IDEAL_COMPANY_PERSONA,
    promptType: '',
    textareaPlaceholder: 'Describe the ideal company persona you want to target...',
    exampleDescription:
      'Industry to target are healthcare and biotech. ATS used are Greenhouse. Number of open jobs are 25',
    description: `Set the ideal company personas that you would like to target.`,
    infoTitle: 'Instruction for Ideal Company Persona:',
  },
  {
    title: IDEAL_CUSTOMER_PERSONA,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `ICP is the profile of customers you would like to target, helping SDRs target and engage high-quality leads.`,
    infoTitle: '',
  },
  {
    title: SUPPORT,
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `Define how you want the agent to handle support queries. It can redirect them to a help page, share an email address or a phone number.`,
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

// ICP (Ideal Customer Persona) constants and types
export type ICPFormData = {
  seniorities: string[];
  departments: string[];
  person_titles: string[];
  locations: string[];
  max_contacts_per_company: number | '';
};

export const ICP_INITIAL_DATA: ICPFormData = {
  seniorities: [],
  departments: [],
  person_titles: [],
  locations: [],
  max_contacts_per_company: '',
};

export interface ICPFieldConfig {
  renderValueType?: 'string' | 'badge';
  maxSelectedCount?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  fieldType: 'select' | 'number';
  label: string;
  name: keyof ICPFormData;
  placeholder: string;
}

export const ICP_FORM_FIELDS: ICPFieldConfig[] = [
  {
    renderValueType: 'badge',
    // maxSelectedCount: 3,
    searchable: false,
    fieldType: 'select',
    label: 'Role',
    name: 'seniorities',
    placeholder: 'Select role of your target customer',
  },
  {
    renderValueType: 'badge',
    // maxSelectedCount: 3,
    searchable: false,
    fieldType: 'select',
    label: 'Job Functions',
    name: 'departments',
    placeholder: 'Select departments of your target customer',
  },
  // {
  //   renderValueType: 'badge',
  //   // maxSelectedCount: 3,
  //   searchable: true,
  //   searchPlaceholder: 'Search Titles',
  //   fieldType: 'select',
  //   label: 'Titles',
  //   name: 'person_titles',
  //   placeholder: 'Select titles of your target customer',
  // },
  {
    renderValueType: 'badge',
    // maxSelectedCount: 5,
    searchable: true,
    searchPlaceholder: 'Search Locations',
    fieldType: 'select',
    label: 'Locations',
    name: 'locations',
    placeholder: 'Select locations of your target customer',
  },
  {
    // maxSelectedCount: 10,
    fieldType: 'number',
    label: 'Contacts per Company',
    name: 'max_contacts_per_company',
    placeholder: 'Enter max number of contacts per company',
  },
];

// Zod schema for ICP validation
export const icpFormSchema = z.object({
  seniorities: z.array(z.string()).min(0, 'At least one seniority is required'),
  departments: z.array(z.string()).min(0, 'At least one department is required'),
  person_titles: z.array(z.string()).min(0, 'At least one person title is required'),
  locations: z.array(z.string()).min(0, 'At least one location is required'),
  max_contacts_per_company: z.union([z.number().int().min(1, 'Must be at least 1'), z.literal('')]),
});
