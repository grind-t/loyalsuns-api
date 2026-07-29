import assert from "node:assert/strict";
import { env } from "node:process";
import { it } from "node:test";

import z from "zod";

import { login } from "./auth.ts";
import { deviceCommodityListResponseSchema } from "./device-commodity.schema.ts";
import { listDeviceCommodities } from "./device-commodity.ts";

it("lists device commodities matching the strict schema", async () => {
  const {
    LOYALSUNS_USERNAME: username,
    LOYALSUNS_PASSWORD: password,
    LOYALSUNS_DEVICE_ID: deviceId,
  } = env;
  assert(username, "LOYALSUNS_USERNAME env var is required");
  assert(password, "LOYALSUNS_PASSWORD env var is required");
  assert(deviceId, "LOYALSUNS_DEVICE_ID env var is required");

  const { access_token: accessToken } = await login({ username, password });
  const response = await listDeviceCommodities({ accessToken, deviceId });

  const { error } = deviceCommodityListResponseSchema.safeParse(response);
  if (error) assert.fail(z.prettifyError(error));
});
