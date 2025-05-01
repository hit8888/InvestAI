import { getschemaShapeValidatedByZode, getZodType, schemaShape } from '@meaku/core/utils/form_fields';
import { FormFieldType } from '@meaku/core/types/webSocketData';

export const createFormSchema = (form_fields: FormFieldType[]) => {
  form_fields.forEach((field) => {
    const fieldSchema = getZodType(field.data_type);

    // Make the field required if is_required is not null or undefined
    if (field.is_required) {
      schemaShape[field.field_name] = fieldSchema;
    } else {
      schemaShape[field.field_name] = fieldSchema.optional();
    }
  });

  return getschemaShapeValidatedByZode(schemaShape);
};
