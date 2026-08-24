const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api");

/**
 * Unified HTTP request fetch wrapper handling JSON parsing, credentials, and cookies.
 */
async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("happiwrapz_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token && !headers["Authorization"] && !headers["authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Always send HTTP-only cookies
  });

  const data = await response.json();

  if (!response.ok || (data.success !== undefined && !data.success)) {
    throw new Error(data.message || data.error || data.detail || "An API error occurred");
  }

  return data;
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
