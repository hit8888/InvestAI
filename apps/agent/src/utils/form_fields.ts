import { z } from 'zod';

const getZodType = (dataType: string) => {
  switch (dataType) {
    case 'string':
      return z.string();
    case 'int':
      return z.number().int();
    case 'email':
      return z.string().email();
    case 'date':
      return z.date();
    case 'datetime':
      return z.string().datetime();
    case 'phone':
      return z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'); // E.164 format
    default:
      return z.string();
  }
};

const getInputType = (dataType: string) => {
  switch (dataType) {
    case 'email':
      return 'email';
    case 'datetime':
      return 'datetime-local';
    case 'date':
      return 'date';
    default:
      return 'text';
  }
};

export { getZodType, getInputType };
