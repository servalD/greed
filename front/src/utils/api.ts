import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { config as dotenvConf } from "dotenv";
dotenvConf();

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000",
  timeout: 10000,
});

function authorizationHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  return token ? {
    Authorization: `Bearer ${token}`,
  } : {};
}

async function refreshTokenIfNeeded(): Promise<boolean> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null;

  if (!refreshToken) return false;

  try {
    const response = await apiClient.post("/refresh", {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return true;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return false;
}

export async function get<T>(url: string, retry = true): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url, {
      headers: {
        ...authorizationHeader(),
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401 && retry) {
      const refreshed = await refreshTokenIfNeeded();
      if (refreshed) {
        return get<T>(url, false); // Retry once
      }
    }

    const errorMessage = error.response?.data || error.message || 'An error occurred';
    throw new Error(errorMessage);
  }
}

async function write<T>(method: string, url: string, body: Record<string, unknown>, retry = true): Promise<T> {
  try {
    const config: AxiosRequestConfig = {
      method: method.toLowerCase() as any,
      url,
      headers: {
        ...authorizationHeader(),
        "Content-Type": "application/json",
      },
      data: body,

      // transformRequest: [(data, headers) => {
      //   console.log("Axios body before send:", data);
      //   console.log(headers)
      //   return JSON.stringify(data);
      // }],
    };

    const response: AxiosResponse<T> = await apiClient.request(config);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401 && retry) {
      const refreshed = await refreshTokenIfNeeded();
      if (refreshed) {
        return write<T>(method, url, body, false); // Retry once
      }
    }

    const errorMessage = error.response?.data || error.message || 'An error occurred';
    throw new Error(errorMessage);
  }
}

export async function post<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("POST", url, body);
}

export async function patch<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("PATCH", url, body);
}

export async function put<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("PUT", url, body);
}

export async function delete_<T>(url: string, body: Record<string, unknown> = {}) {
  return write<T>("DELETE", url, body);
}
