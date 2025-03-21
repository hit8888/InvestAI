import { z } from 'zod';

export const UpdateSessionDataPayloadSchema = z.object({
  query_params: z.record(z.string().nullish()),
  referrer: z.string(),
  parent_url: z.string(),
});

export type UpdateSessionDataPayload = z.infer<typeof UpdateSessionDataPayloadSchema>;
