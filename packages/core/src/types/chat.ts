import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.number(),
  data_source_id: z.number(),
  title: z.string(),
  url: z.string(),
  data_source_name: z.string(),
  data_source_type: z.string(),
});

export const MediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string(),
});

export const MessageSchema = z.object({
  message_id: z.number(),
  session_id: z.string(),
  role: z.enum(["user", "ai"]),
  message: z.string(),
  media: MediaSchema.nullable(),
  documents: z.array(DocumentSchema),
});

// export const MessageSchema = z.object({
//   response_id: z.string(),
//   message: z.string(),
//   is_complete: z.boolean(),
//   documents: z.array(DocumentSchema),
//   media: MediaSchema.nullable(),
// });

export const AIResponseSchema = z.object({
  response_id: z.string(),
  message: z.string(),
  media: MediaSchema.nullable(),
  is_complete: z.boolean(),
  documents: z.array(DocumentSchema),
  is_loading: z.boolean().optional(),
});

export type Message = {
  id: number | string;
  message: string;
  media: z.infer<typeof MediaSchema> | null;
  documents: z.infer<typeof DocumentSchema>[];
  role: z.infer<typeof MessageSchema>["role"];
  isPartOfHistory?: boolean;
  is_loading?: boolean;
};

export type AIResponse = z.infer<typeof AIResponseSchema>;
