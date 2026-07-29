import assert from "node:assert/strict";
import { env } from "node:process";
import { it } from "node:test";

import z from "zod";

import { listDeviceCommodities } from "./device-commodity.ts";
import { deviceFormulaDetailListResponseSchema } from "./device-formula-detail.schema.ts";
import { listDeviceFormulaDetails } from "./device-formula-detail.ts";

it("lists device formula details matching the strict schema", async () => {
  const { LOYALSUNS_ACCESS_TOKEN: accessToken, LOYALSUNS_DEVICE_ID: deviceId } = env;
  assert(accessToken, "LOYALSUNS_ACCESS_TOKEN env var is required");
  assert(deviceId, "LOYALSUNS_DEVICE_ID env var is required");

  const commodities = await listDeviceCommodities({ accessToken, deviceId });
  const [commodity] = commodities.data.records;
  assert(commodity, "expected at least one device commodity to test formula details against");

  const response = await listDeviceFormulaDetails({
    accessToken,
    templateCommodityId: commodity.id,
  });

  const { error } = deviceFormulaDetailListResponseSchema.safeParse(response);
  if (error) assert.fail(z.prettifyError(error));
});
