import assert from "node:assert/strict";
import { env } from "node:process";
import { it } from "node:test";

import z from "zod";

import { deviceChannelListResponseSchema } from "./device-channel.schema.ts";
import { listDeviceChannels } from "./device-channel.ts";

it("lists device channels matching the strict schema", async () => {
  const { LOYALSUNS_ACCESS_TOKEN: accessToken, LOYALSUNS_DEVICE_ID: deviceId } = env;
  assert(accessToken, "LOYALSUNS_ACCESS_TOKEN env var is required (set by e2e-global-setup)");
  assert(deviceId, "LOYALSUNS_DEVICE_ID env var is required");

  const response = await listDeviceChannels({ accessToken, deviceId });

  const { error } = deviceChannelListResponseSchema.safeParse(response);
  if (error) assert.fail(z.prettifyError(error));
});
