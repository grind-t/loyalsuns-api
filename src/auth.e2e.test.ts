import assert from "node:assert/strict";
import { env } from "node:process";
import { it } from "node:test";

import z from "zod";

import { loginResponseSchema } from "./auth.schema.ts";
import { login, refreshToken } from "./auth.ts";

function assertMatchesSchema(response: unknown) {
  const { error } = loginResponseSchema.safeParse(response);
  if (error) assert.fail(z.prettifyError(error));
}

it("logins and refreshes token", async () => {
  const { LOYALSUNS_USERNAME: username, LOYALSUNS_PASSWORD: password } = env;
  assert(username, "LOYALSUNS_USERNAME env var is required");
  assert(password, "LOYALSUNS_PASSWORD env var is required");

  const loginResponse = await login({ username, password });
  assertMatchesSchema(loginResponse);

  const refreshResponse = await refreshToken({
    refreshToken: loginResponse.refresh_token,
    tenantId: loginResponse.tenant_id,
  });
  assertMatchesSchema(refreshResponse);
});
