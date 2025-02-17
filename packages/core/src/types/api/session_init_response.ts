import { z } from "zod";
import { ConfigurationSchema } from "./configuration_response";

export const SessionSchema = z.object({
  agent_id: z.number(),
  session_id: z.string(),
  prospect_id: z.string(),
  configuration: ConfigurationSchema,
});

export type SessionApiResponse = z.infer<typeof SessionSchema>;

export type StyleConfig = z.infer<typeof ConfigurationSchema>["style_config"];
