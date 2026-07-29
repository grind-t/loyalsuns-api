import { z } from "zod";

export const loginResponseSchema = z
  .object({
    tenant_id: z.string(),
    user_id: z.string(),
    dept_id: z.string(),
    post_id: z.string(),
    role_id: z.string(),
    oauth_id: z.string(),
    account: z.string(),
    user_name: z.string(),
    nick_name: z.string(),
    role_name: z.string(),
    avatar: z.string(),
    access_token: z.string(),
    refresh_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    detail: z.object({ type: z.string() }).strict(),
    license: z.string(),
    identityType: z.string(),
  })
  .strict();

export type LoginResponse = z.infer<typeof loginResponseSchema>;
