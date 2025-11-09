import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./firebase"; // Import Firebase auth instance

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`API Error: ${res.status} ${text}`);
  }
}

const buildAuthHeaders = async (initHeaders?: HeadersInit) => {
  const headers = new Headers(initHeaders);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const apiRequest = async <TResponse = unknown>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<TResponse> => {
  const headers = await buildAuthHeaders(init.headers);
  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 204) {
    return undefined as TResponse;
  }

  await throwIfResNotOk(res);
  return (await res.json()) as TResponse;
};

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey.join("/");
  const headers = await buildAuthHeaders();
  const res = await fetch(url, { headers });

  // Handle case where user is unauthorized but there was no server error
  if (res.status === 401) {
    // Returning null is a common pattern in react-query for auth errors
    // This allows components to handle the "logged out" state gracefully
    return null;
  }

  await throwIfResNotOk(res);
  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on auth-related errors
        if (error.message?.includes("401")) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
