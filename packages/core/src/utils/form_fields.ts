import { z, ZodSchema } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const getZodType = (dataType: string) => {
  switch (dataType) {
    case "string":
      return z.string();
    case "int":
      return z.number().int();
    case "email":
      return z.string().email();
    case "date":
      return z.date();
    case "datetime":
      return z.string().datetime();
    case "phone":
      return z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }); // E.164 format
    default:
      return z.string();
  }
};

const getInputType = (dataType: string) => {
  switch (dataType) {
    case "email":
      return "email";
    case "datetime":
      return "datetime-local";
    case "date":
      return "date";
    default:
      return "text";
  }
};
const schemaShape: Record<string, ZodSchema> = {};

const getschemaShapeValidatedByZode = (
  schemaShape: Record<string, ZodSchema>
) => {
  return z.object(schemaShape);
};

const getFormSchemaTypeDefinition = <T extends ZodSchema>(
  formSchema: T
): z.infer<T> => {
  return formSchema._type;
};

export {
  getZodType,
  getInputType,
  schemaShape,
  getschemaShapeValidatedByZode,
  getFormSchemaTypeDefinition,
};
