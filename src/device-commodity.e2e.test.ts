import assert from "node:assert/strict";
import { env } from "node:process";
import { it } from "node:test";

import z from "zod";

import { deviceCommodityListResponseSchema } from "./device-commodity.schema.ts";
import { listDeviceCommodities } from "./device-commodity.ts";

it("lists device commodities matching the strict schema", async () => {
  const { LOYALSUNS_ACCESS_TOKEN: accessToken, LOYALSUNS_DEVICE_ID: deviceId } = env;
  assert(accessToken, "LOYALSUNS_ACCESS_TOKEN env var is required (set by e2e-global-setup)");
  assert(deviceId, "LOYALSUNS_DEVICE_ID env var is required");

  const response = await listDeviceCommodities({ accessToken, deviceId });

  const { error } = deviceCommodityListResponseSchema.safeParse(response);
  if (error) assert.fail(z.prettifyError(error));
});
