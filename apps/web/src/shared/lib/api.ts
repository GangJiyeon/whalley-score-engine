const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type FetchOptions = Omit<RequestInit, "method">;

async function request<T>(
  	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  	path: string,
  	options: FetchOptions = {}
): Promise<T> {
  	const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  	const res = await fetch(url, {
    	method,
    	...options,
    	headers: {
    		"Content-Type": "application/json",
      	...(options.headers ?? {}),
    	},
    	cache: "no-store",
  	});

  	if (!res.ok) {
    	const text = await res.text().catch(() => "");
    	throw new Error(`API ${method} ${url} failed: ${res.status} ${text}`);
  	}

  	return (await res.json()) as T;
}

export async function apiGet<T>(path: string, options?: FetchOptions) {
  return request<T>("GET", path, options);
}

export async function apiPost<T>(path: string, body?: unknown, options?: FetchOptions) {
  return request<T>("POST", path, {
    ...options,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export { API_BASE_URL };
