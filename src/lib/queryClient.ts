import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Create and export queryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
  
  // For development, simulate API responses
  console.log('API Request (simulated):', method, url);
  
  // Simulate API responses for development
  if (url.includes('/api/analytics')) {
    return {
      entityStats: {
        "PERSON": 145,
        "ORGANIZATION": 89,
        "LOCATION": 67,
        "DATE": 234,
        "MONEY": 45
      },
      processingStats: {
        totalDocuments: 42,
        processingQueue: 3,
        avgProcessingTime: 4.2,
        avgAccuracy: 0.89
      }
    };
  }
  
  if (url.includes('/api/documents')) {
    return [];
  }
  
  // Default empty response
  return {};
}

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey[0] as string;
  return apiRequest(url);
};

queryClient.setQueryDefaults([], { queryFn: defaultQueryFn });