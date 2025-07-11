import { config as dotenvConf } from "dotenv";
dotenvConf();

function authorizationHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  console.log("Authorization Header Token:", token);
  return token ? {
    Authorization: `Bearer ${token}`,
  } : {};
}

async function refreshTokenIfNeeded() {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null;

  if (!refreshToken) return false;

  try {
    const response = await fetch(buildUrl(process.env.NEXT_PUBLIC_API_URL, "/refresh"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return true;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return false;
}

function buildUrl(base?: string, ...parts: string[]) {
  base = base || "http://127.0.0.1:3000";
  return [base.replace(/\/$/, ""), ...parts.map((part) => part.replace(/^\//, ""))].join("/");
}

export async function get<T>(url: string, retry = true): Promise<T> {
  const fullUrl = buildUrl(process.env.NEXT_PUBLIC_API_URL, url);

  const response = await fetch(fullUrl, {
    headers: {
      ...authorizationHeader(),
    },
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshTokenIfNeeded();
    if (refreshed) {
      return get<T>(url, false); // Retry once
    }
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

async function write<T>(method: string, url: string, body: Record<string, unknown>, retry = true): Promise<T> {
  const fullUrl = buildUrl(process.env.NEXT_PUBLIC_API_URL, url);

  const response = await fetch(fullUrl, {
    method,
    headers: {
      ...authorizationHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshTokenIfNeeded();
    if (refreshed) {
      return write<T>(method, url, body, false); // Retry once
    }
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export async function post<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("POST", url, body);
}

export async function patch<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("PATCH", url, body);
}

export async function delete_<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("DELETE", url, body);
}
