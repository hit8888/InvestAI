import { z } from "zod";

export const DataSourceSchema = z.object({
  id: z.number(),
  data_source_id: z.number(),
  title: z.string().nullable(),
  url: z.string().nullable(),
  data_source_name: z.string(),
  data_source_type: z.string(),
  text: z.string().nullable(),
});
