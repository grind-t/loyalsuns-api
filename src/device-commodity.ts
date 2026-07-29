import type { DeviceCommodityListResponse } from "./device-commodity.schema.ts";

const DEVICE_COMMODITY_LIST_URL =
  "https://coffee.loyalsuns.com:56387/api/blade-deviceCommodity/deviceCommodity/list";

export interface ListDeviceCommoditiesParams {
  accessToken: string;
  deviceId: string;
  current?: number;
  size?: number;
  commodityCode?: string;
  commodityName?: string;
  coldOrHot?: 0 | 1;
  categoriesId?: string;
}

export async function listDeviceCommodities({
  accessToken,
  deviceId,
  current = 1,
  size = 10,
  commodityCode,
  commodityName,
  coldOrHot,
  categoriesId,
}: ListDeviceCommoditiesParams): Promise<DeviceCommodityListResponse> {
  const url = new URL(DEVICE_COMMODITY_LIST_URL);
  url.searchParams.set("deviceId", deviceId);
  url.searchParams.set("current", String(current));
  url.searchParams.set("size", String(size));
  if (commodityCode !== undefined) url.searchParams.set("commodityCode", commodityCode);
  if (commodityName !== undefined) url.searchParams.set("commodityName", commodityName);
  if (coldOrHot !== undefined) url.searchParams.set("coldOrHot", String(coldOrHot));
  if (categoriesId !== undefined) url.searchParams.set("categoriesId", categoriesId);

  const response = await fetch(url, {
    headers: {
      "blade-auth": `bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Device commodity list request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
