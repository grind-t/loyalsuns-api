import type { DeviceFormulaDetailListResponse } from "./device-formula-detail.schema.ts";

const DEVICE_FORMULA_DETAIL_LIST_URL =
  "https://coffee.loyalsuns.com:56387/api/blade-deviceFormulaDetail/deviceFormulaDetail/list";

export interface ListDeviceFormulaDetailsParams {
  accessToken: string;
  templateCommodityId: string;
  current?: number;
  size?: number;
}

export async function listDeviceFormulaDetails({
  accessToken,
  templateCommodityId,
  current = 1,
  size = 1000,
}: ListDeviceFormulaDetailsParams): Promise<DeviceFormulaDetailListResponse> {
  const url = new URL(DEVICE_FORMULA_DETAIL_LIST_URL);
  url.searchParams.set("templateCommodityId", templateCommodityId);
  url.searchParams.set("current", String(current));
  url.searchParams.set("size", String(size));

  const response = await fetch(url, {
    headers: {
      "blade-auth": `bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Device formula detail list request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
