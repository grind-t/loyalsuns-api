import type { DeviceChannelListResponse } from "./device-channel.schema.ts";

const DEVICE_CHANNEL_LIST_URL =
  "https://coffee.loyalsuns.com:56387/api/blade-deviceChannel/deviceChannel/list";

export interface ListDeviceChannelsParams {
  accessToken: string;
  deviceId: string;
  current?: number;
  size?: number;
  language?: string;
}

export async function listDeviceChannels({
  accessToken,
  deviceId,
  current = 1,
  size = 1000,
  language = "en",
}: ListDeviceChannelsParams): Promise<DeviceChannelListResponse> {
  const url = new URL(DEVICE_CHANNEL_LIST_URL);
  url.searchParams.set("deviceId", deviceId);
  url.searchParams.set("current", String(current));
  url.searchParams.set("size", String(size));
  url.searchParams.set("language", language);

  const response = await fetch(url, {
    headers: {
      "blade-auth": `bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Device channel list request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
