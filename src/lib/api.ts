const API_ERROR_MESSAGES = {
  network: "Network error. Please check your connection.",
  default: "Something went wrong. Please try again.",
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data);
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error(API_ERROR_MESSAGES.network);
  }
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(url: string) =>
    request<T>(url, { method: "DELETE" }),
};
