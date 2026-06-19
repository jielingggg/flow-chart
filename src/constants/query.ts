import type { QueryOptions } from "@tanstack/vue-query"

export const QUERY_CONSTANTS: Partial<QueryOptions> = {
  refetchOnWindowFocus: false,
  networkMode: "always",
  staleTime: Infinity,
  gcTime: 60 * 60 * 1000,
}
