import { createHash } from "node:crypto";

import type { LoginResponse } from "./auth.schema.ts";

const TOKEN_URL = "https://coffee.loyalsuns.com:56387/api/blade-auth/oauth/token";
// BladeX/Saber default OAuth2 client credentials, sent as Basic auth by every client of this API.
const CLIENT_AUTHORIZATION = `Basic ${Buffer.from("saber:saber_secret").toString("base64")}`;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshCredentials {
  refreshToken: string;
  // The refresh grant 500s without the tenant the refresh token was issued for.
  tenantId: string;
}

function md5(input: string): string {
  return createHash("md5").update(input).digest("hex");
}

async function requestToken(
  searchParams: Record<string, string>,
  tenantId: string,
): Promise<LoginResponse> {
  const url = new URL(TOKEN_URL);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: CLIENT_AUTHORIZATION,
      "captcha-code": "",
      "captcha-key": "",
      "dept-id": "",
      "role-id": "",
      "tenant-id": tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`OAuth token request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function login({ username, password }: LoginCredentials): Promise<LoginResponse> {
  return requestToken(
    {
      tenantId: "",
      username,
      password: md5(password),
      grant_type: "password",
      scope: "all",
      type: "account",
    },
    "",
  );
}

export async function refreshToken({
  refreshToken: token,
  tenantId,
}: RefreshCredentials): Promise<LoginResponse> {
  return requestToken(
    {
      tenantId,
      grant_type: "refresh_token",
      scope: "all",
      refresh_token: token,
    },
    tenantId,
  );
}
