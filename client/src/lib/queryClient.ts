import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<any> {
  const { method = 'GET', body, headers = {} } = options || {};
  const isFormData = body instanceof FormData;
  
  // Add base URL if not already absolute
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Add Cognito authorization header if token exists
  const cognitoToken = localStorage.getItem('cognito_access_token');
  if (cognitoToken) {
    headers.Authorization = `Bearer ${cognitoToken}`;
  }
  
  const res = await fetch(fullUrl, {
    method,
    headers: body && !isFormData ? { "Content-Type": "application/json", ...headers } : headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    credentials: "include",
  });

  // Handle token expiration
  if (res.status === 401 && cognitoToken) {
    localStorage.removeItem('cognito_access_token');
    window.location.reload();
    return;
  }

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const url = queryKey.join("/") as string;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    const headers: Record<string, string> = {};
    const cognitoToken = localStorage.getItem('cognito_access_token');
    if (cognitoToken) {
      headers.Authorization = `Bearer ${cognitoToken}`;
    }
    
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});