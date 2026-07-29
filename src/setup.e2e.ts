import assert from "node:assert/strict";
import { env } from "node:process";

import z from "zod";

import { loginResponseSchema } from "./auth.schema.ts";
import { login } from "./auth.ts";

export async function globalSetup(): Promise<void> {
  const { LOYALSUNS_USERNAME: username, LOYALSUNS_PASSWORD: password } = env;
  assert(username, "LOYALSUNS_USERNAME env var is required");
  assert(password, "LOYALSUNS_PASSWORD env var is required");

  const loginResponse = await login({ username, password });
  const { error } = loginResponseSchema.safeParse(loginResponse);
  if (error) assert.fail(z.prettifyError(error));

  env.LOYALSUNS_ACCESS_TOKEN = loginResponse.access_token;
  env.LOYALSUNS_REFRESH_TOKEN = loginResponse.refresh_token;
  env.LOYALSUNS_TENANT_ID = loginResponse.tenant_id;
}
