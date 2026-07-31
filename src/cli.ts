#!/usr/bin/env node
import process, { env } from "node:process";

import { Command } from "commander";
import Conf from "conf";

import { login, refreshToken } from "./auth.ts";
import { listDeviceChannels } from "./device-channel.ts";
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

const cli = new Command("loyalsuns");

cli
  .command("login")
  .description("Log in and persist the session for other commands")
  .option("--username <username>", "Account username", env.LOYALSUNS_USERNAME)
  .option("--password <password>", "Account password", env.LOYALSUNS_PASSWORD)
  .action(async (options) => {
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

cli
  .command("logout")
  .description("Clear the persisted session")
  .action(() => {
    conf.clear();
    console.log("Logged out.");
  });

cli
  .command("commodities <deviceId>")
  .description("List a device's commodities")
  .option("--code <code>", "Filter by commodity code")
  .option("--name <name>", "Filter by commodity name")
  .option("--cold-or-hot <coldOrHot>", "Filter by 0 (cold) or 1 (hot)")
  .option("--categories-id <categoriesId>", "Filter by categories id")
  .option("--current <current>", "Page number", "1")
  .option("--size <size>", "Page size", "10")
  .option("--with-formula-details", "Include formula details for each commodity")
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

    if (options.withFormulaDetails) {
      for (const commodity of commodities) {
        (commodity as any).materials = await listDeviceFormulaDetails({
          accessToken,
          templateCommodityId: commodity.id,
        }).then((v) => v.data.records);
      }
    }

    printJson(commodities);
  });

cli
  .command("channels <deviceId>")
  .description("List a device's channels")
  .option("--current <current>", "Page number", "1")
  .option("--size <size>", "Page size", "1000")
  .option("--language <language>", "Response language", "en")
  .action(async (deviceId, options) => {
    const accessToken = await resolveAccessToken();
    const channels = await listDeviceChannels({
      accessToken,
      deviceId,
      current: Number(options.current),
      size: Number(options.size),
      language: options.language,
    }).then((v) => v.data.records);

    printJson(channels);
  });

cli.version("1.0.0");

try {
  await cli.parseAsync();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
