import { getschemaShapeValidatedByZode, getZodType, type ZodSchema } from '@neuraltrade/core/utils/form_fields';
import { FormFieldType } from '@neuraltrade/core/types/webSocketData';

export const createFormSchema = (form_fields: FormFieldType[]) => {
  // Create a local schema shape instead of using the global one
  const localSchemaShape: Record<string, ZodSchema> = {};

  form_fields.forEach((field) => {
    const fieldSchema = getZodType(field.label, field.data_type);

    // Make the field required if is_required is not null or undefined
    if (field.is_required) {
      localSchemaShape[field.field_name] = fieldSchema;
    } else {
      localSchemaShape[field.field_name] = fieldSchema.optional();
    }
  });

  return getschemaShapeValidatedByZode(localSchemaShape);
};
