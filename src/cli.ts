#!/usr/bin/env node
import process, { env } from "node:process";

import { cac } from "cac";
import Conf from "conf";

import { login, refreshToken } from "./auth.ts";
import { listDeviceCommodities } from "./device-commodity.ts";
import { listDeviceFormulaDetails } from "./device-formula-detail.ts";

const conf = new Conf<{
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  expiresAt: number;
}>({ projectName: "loyalsuns" });

function fail(err: unknown): never {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

async function resolveAccessToken(): Promise<string> {
  const { accessToken, expiresAt } = conf.store;

  if (!accessToken) fail("Not logged in. Run `loyalsuns login` first.");
  if (Date.now() < expiresAt) return accessToken;

  const response = await refreshToken({
    refreshToken: conf.store.refreshToken,
    tenantId: conf.store.tenantId,
  });

  conf.set({
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    tenantId: response.tenant_id,
    expiresAt: Date.now() + response.expires_in * 1000,
  });

  return response.access_token;
}

const cli = cac("loyalsuns");

cli
  .command("login", "Log in and persist the session for other commands")
  .option("--username <username>", "Account username", {
    default: env.LOYALSUNS_USERNAME,
  })
  .option("--password <password>", "Account password", {
    default: env.LOYALSUNS_PASSWORD,
  })
  .action(async (options: { username?: string; password?: string }) => {
    const { username, password } = options;

    if (!username || !password)
      fail(
        "Username and password are required (--username/--password or LOYALSUNS_USERNAME/LOYALSUNS_PASSWORD).",
      );

    try {
      const response = await login({ username, password });

      if (!response.access_token) fail(`Login failed: ${JSON.stringify(response)}`);

      conf.set({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tenantId: response.tenant_id,
        expiresAt: Date.now() + response.expires_in * 1000,
      });

      console.log(`Logged in as ${response.user_name}.`);
    } catch (error) {
      fail(error);
    }
  });

cli.command("logout", "Clear the persisted session").action(() => {
  conf.clear();
  console.log("Logged out.");
});

cli
  .command("commodities <deviceId>", "List a device's commodities")
  .option("--code <code>", "Filter by commodity code")
  .option("--name <name>", "Filter by commodity name")
  .option("--cold-or-hot <coldOrHot>", "Filter by 0 (cold) or 1 (hot)")
  .option("--categories-id <categoriesId>", "Filter by categories id")
  .option("--current <current>", "Page number", { default: 1 })
  .option("--size <size>", "Page size", { default: 10 })
  .action(async (deviceId, options) => {
    const accessToken = await resolveAccessToken();
    const commodities = await listDeviceCommodities({
      accessToken,
      deviceId,
      commodityCode: options.code,
      commodityName: options.name,
      coldOrHot: options.coldOrHot,
      categoriesId: options.categoriesId,
      current: Number(options.current),
      size: Number(options.size),
    }).then((v) => v.data.records);

    const data = [];

    for (const commodity of commodities) {
      const materials = await listDeviceFormulaDetails({
        accessToken,
        templateCommodityId: commodity.id,
      }).then((v) => v.data.records);

      data.push({
        code: commodity.commodityCode,
        name: commodity.commodityName,
        img: commodity.commodityImg,
        category: commodity.categoriesName,
        sort: commodity.sort,
        price: commodity.commodityPrice,
        discountPrice: commodity.discountPrice,
        currency: commodity.currencySymbols,
        recipe: {
          coffeeDispenseOrder: commodity.coffeeOrder,
          powderDispenseOrder: commodity.canisterOrder,
          syrupDispenseOrder: commodity.pumpOrder,
          coffeeVolume: commodity.coffeeVolume,
          coffeeBeansAmount: commodity.beansVolume,
          coffeePowderPressingForce: commodity.powderPressingForce,
          coffeeExtractionPressure: commodity.extractionPressure,
          coffeeExtractionFlowRate: commodity.extractionFlowRate,
          coffeeWettingWaterVolume: commodity.wettingWaterVolume,
          coffeeWettingWatterSpeed: commodity.wettingWaterSpeed,
          coffeeWettingWaterTime: commodity.wettingWaterTime,
          iceVolume: commodity.iceVolume,
          materials: materials.map((material) => ({
            channelType: material.channelType,
            channelIndex: material.channelIndex,
            name: material.ingredients,
            dispenseTime: material.shipments,
            waterDispenseTime: material.waterAmount,
            waterDispenseType: material.waterType,
          })),
        },
      });
    }

    printJson(data);
  });

cli.help();
cli.version("1.0.0");

try {
  cli.parse();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
