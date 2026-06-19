import type { TCustomTypes } from "@/types/schemas/dataNodes"

export const EDITABLE_FIELD_TYPES = [
  "addComment",
  "sendMessage",
  "dateTime",
] as const satisfies TCustomTypes[]
