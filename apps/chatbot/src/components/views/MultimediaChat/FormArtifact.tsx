import { FormArtifactType, FormFieldType } from "@meaku/core/types/chat";
import Card from "@breakout/design-system/components/layout/card";
import CardContent from "@breakout/design-system/components/layout/card-content";
import CardHeader from "@breakout/design-system/components/layout/card-header";
import { Form, useForm } from "@breakout/design-system/components/layout/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodSchema } from "zod";
import Button from "@breakout/design-system/components/layout/button";
import { getZodType } from "../../../utils/form_fields.ts";
import ChatFormField from "./ChatFormField.tsx";
import CardTitle from "@breakout/design-system/components/layout/card-title";
import useWebSocketChat from "../../../hooks/useWebSocketChat.tsx";
import { useState } from "react";
import CardDescription from "@breakout/design-system/components/layout/card-description";

interface IFormProps {
  artifact: FormArtifactType;
}

const createFormSchema = (form_fields: FormFieldType[]) => {
  const schemaShape: Record<string, ZodSchema> = {};

  form_fields.forEach((field) => {
    const fieldSchema = getZodType(field.data_type);

    // Make the field required if is_required is not null or undefined
    if (field.is_required) {
      schemaShape[field.label] = fieldSchema;
    } else {
      schemaShape[field.label] = fieldSchema.optional();
    }
  });

  return z.object(schemaShape);
};

const FormArtifact = (props: IFormProps) => {
  const {
    artifact: { form_fields },
  } = props;
  const [submitted, setSubmitted] = useState(false);
  const { handleSendUserMessage } = useWebSocketChat();

  const formSchema = createFormSchema(form_fields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSendUserMessage("", "FORM", values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Thank You for Sharing Your Details!</CardTitle>
          <CardDescription>
            Info submitted! We will reach out soon.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Demo Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {form_fields.map((field, i) => (
              <ChatFormField key={i} form={form} form_field={field} />
            ))}
            <Button type="submit">Submit Information</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormArtifact;
