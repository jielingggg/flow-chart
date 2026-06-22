import type { TCustomTypes } from "@/types/schemas/dataNodes"

export const EDITABLE_FIELD_TYPES = [
  "addComment",
  "sendMessage",
  "dateTime",
] as const satisfies TCustomTypes[]

export const NODE_WIDTH = 160
export const NODE_HEIGHT = 64
