import { z } from "zod";

// organizationDetails
export const OrganizationDetailsSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  "tenant-name": z.string().optional(),
  logo: z.string().optional(),
});
export type OrganizationDetails = z.infer<typeof OrganizationDetailsSchema>;

// AuthResponse
export const AuthResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
  is_staff: z.boolean(),
  date_joined: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format. Expected ISO 8601 format.",
  }),
  last_login: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format. Expected ISO 8601 format.",
  }),
  organizations: z.array(OrganizationDetailsSchema),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

