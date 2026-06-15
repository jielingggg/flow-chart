import type { QueryClientConfig } from "@tanstack/vue-query"

export const QUERY_CONSTANTS: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "always",
      staleTime: Infinity,
      gcTime: 60 * 60 * 1000,
    },
  },
}
