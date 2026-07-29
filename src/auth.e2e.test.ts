import assert from "node:assert/strict";
import { env } from "node:process";
import { it } from "node:test";

import z from "zod";

import { loginResponseSchema } from "./auth.schema.ts";
import { refreshToken } from "./auth.ts";

it("refreshes token matching the strict schema", async () => {
  const { LOYALSUNS_REFRESH_TOKEN: token, LOYALSUNS_TENANT_ID: tenantId } = env;
  assert(token, "LOYALSUNS_REFRESH_TOKEN env var is required");
  assert(tenantId, "LOYALSUNS_TENANT_ID env var is required");

  const refreshResponse = await refreshToken({ refreshToken: token, tenantId });

  const { error } = loginResponseSchema.safeParse(refreshResponse);
  if (error) assert.fail(z.prettifyError(error));
});
