import { z, ZodSchema } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

// List of common free email providers
const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'yandex.com',
  'gmx.com',
  'live.com',
  'msn.com',
];

// Function to check if email is a business email (not from common free providers)
const isBusinessEmail = (email: string | null) => {
  const domain = email?.split('@')[1]?.toLowerCase();
  return domain && !FREE_EMAIL_DOMAINS.includes(domain);
};

// Function to check if email is valid
const isEmail = (email: string | null) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
};

// Function to check if value is a number only
const isNumberOnly = (value: string | null) => {
  const numbersOnlyRegex = /^\d*$/;
  return value && numbersOnlyRegex.test(value);
};

const checkIsPhoneNumber = (value: string | null) => {
  return value && isValidPhoneNumber(value);
};

// Creates a Zod schema for required string fields that can be initially null
const createRequiredStringSchema = (errorMessage: string) => {
  return z
    .string()
    .nullable()
    .default('')
    .refine((val) => val && val.length > 0, {
      message: errorMessage,
    });
};

// Function to get email schema
const getEmailSchema = () => {
  return createRequiredStringSchema('Please enter your email').refine(isEmail, {
    message: 'Please enter a valid email',
  });
};

// Function to get zod type based on data type
const getZodType = (label: string, dataType: string) => {
  const errorMessage = `Please enter your ${label.toLowerCase()}`;
  switch (dataType) {
    case 'string':
      return createRequiredStringSchema(errorMessage);
    case 'picklist':
      return z.string();
    case 'int':
      return createRequiredStringSchema(errorMessage)
        .refine(isNumberOnly, {
          message: 'Only numbers are allowed',
        })
        .transform((val) => {
          const num = parseInt(val || '0', 10);
          return num;
        });
    case 'email':
      return getEmailSchema();
    case 'business_email':
      return getEmailSchema().refine(isBusinessEmail, {
        message: 'Please add your work email',
      });
    case 'date':
      return z.date();
    case 'datetime':
      return z.string().datetime();
    case 'phone':
      return createRequiredStringSchema(errorMessage).refine(checkIsPhoneNumber, {
        message: 'Invalid phone number',
      });
    default:
      return z.string();
  }
};

const getInputType = (dataType: string) => {
  switch (dataType) {
    case 'email':
    case 'business_email':
      return 'email';
    case 'datetime':
      return 'datetime-local';
    case 'date':
      return 'date';
    case 'int':
      return 'number';
    default:
      return 'text';
  }
};
const schemaShape: Record<string, ZodSchema> = {};

const getschemaShapeValidatedByZode = (schemaShape: Record<string, ZodSchema>) => {
  return z.object(schemaShape);
};

const getFormSchemaTypeDefinition = <T extends ZodSchema>(formSchema: T): z.infer<T> => {
  return formSchema._type;
};

export { getZodType, getInputType, schemaShape, getschemaShapeValidatedByZode, getFormSchemaTypeDefinition };
