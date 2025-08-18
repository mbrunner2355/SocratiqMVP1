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
  
  // Add base URL if not already absolute - force local development for Replit
  const isDevelopment = window.location.hostname.includes('replit') || 
                       window.location.hostname.includes('repl.co') || 
                       window.location.hostname === 'localhost' ||
                       import.meta.env.DEV;
  const baseUrl = isDevelopment ? 'http://localhost:5000' : 'https://1d6xdpfju9.execute-api.us-east-1.amazonaws.com/Prod';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Add Cognito authorization header if token exists
  const cognitoToken = localStorage.getItem('cognito_access_token');
  if (cognitoToken) {
    headers.Authorization = `Bearer ${cognitoToken}`;
  }
  
  console.log('Making API request to:', fullUrl, { method, body });
  console.log('Fetch options:', { method, headers, credentials: "include" });
  
  const fetchOptions: RequestInit = {
    method,
    headers: body && !isFormData ? { "Content-Type": "application/json", ...headers } : headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    credentials: "include",
  };
  
  console.log('About to fetch with options:', fetchOptions);
  
  let res: Response;
  try {
    res = await fetch(fullUrl, fetchOptions);
    console.log('Fetch completed successfully. Response status:', res.status);
  } catch (fetchError: any) {
    console.error('Fetch failed:', fetchError);
    throw new Error(`Network error: ${fetchError?.message || 'Unknown fetch error'}`);
  }

  console.log('API response:', res.status, res.statusText);

  // Handle token expiration
  if (res.status === 401 && cognitoToken) {
    localStorage.removeItem('cognito_access_token');
    window.location.reload();
    return;
  }

  if (!res.ok) {
    let errorText;
    try {
      errorText = await res.text();
    } catch (e) {
      errorText = res.statusText;
    }
    console.log('API error response:', errorText);
    const error = new Error(`${res.status}: ${errorText}`);
    console.error('Throwing API error:', error);
    throw error;
  }
  
  let responseData;
  try {
    responseData = await res.json();
    console.log('API response data:', responseData);
    return responseData;
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error('Invalid JSON response from server');
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const isDevelopment = window.location.hostname.includes('replit.co') || window.location.hostname.includes('repl.co') || window.location.hostname === 'localhost';
    const baseUrl = import.meta.env.VITE_API_BASE_URL || (isDevelopment ? '' : 'https://1d6xdpfju9.execute-api.us-east-1.amazonaws.com/Prod');
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
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
      throwOnError: false,
    },
    mutations: {
      retry: false,
      throwOnError: false,
    },
  },
});