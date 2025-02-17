import { z } from "zod";

export enum FeedbackEnum {
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
}

export const FeedbackRequestPayloadSchema = z.object({
  response_id: z.string(),
  positive_feedback: z.boolean(),
  category: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
});

export type FeedbackRequestPayload = z.infer<
  typeof FeedbackRequestPayloadSchema
>;
