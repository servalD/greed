import { config as dotenvConf } from "dotenv";
dotenvConf();

function authorizationHeader() {
  return {
    Authorization: `Bearer ${'jwt to have'}`,
  };
}

function buildUrl(base?: string, ...parts: string[]) {
  base = base || "http://127.0.0.1:3000";
  return [base.replace(/\/$/, ""), ...parts.map((part) => part.replace(/^\//, ""))].join("/");
}

export async function get<T>(url: string) {
  const fullUrl = buildUrl(process.env.NEXT_PUBLIC_API_URL, url);

  const response = await fetch(fullUrl, {
    headers: authorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

async function write<T>(method: string, url: string, body: Record<string, unknown>) {
  const fullUrl = buildUrl(process.env.NEXT_PUBLIC_API_URL, url);

  const response = await fetch(fullUrl, {
    method,
    headers: {
      ...authorizationHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

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
