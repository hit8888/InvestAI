import { z } from "zod";

export const DataSourceSchema = z.object({
  id: z.number(),
  data_source_id: z.number(),
  data_source_name: z.string().optional().nullable(),
  data_source_type: z.string(),
  title: z.string().nullable(),
  url: z.string().nullable(),
  text: z.string().nullable(),
  similarity_score: z.number().optional().nullable(),
});
