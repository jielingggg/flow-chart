import type { DefaultNodeTypes } from "@vue-flow/core"
import { z } from "zod"

const NodeId = z.union([z.number(), z.string()])

// ─── Predefined Type: sendMessage (Payload items) ──────────────────────────────────────────────

const TTextPayload = z.object({
  type: z.literal("text"),
  text: z.string(),
})

const TAttachmentPayload = z.object({
  type: z.literal("attachment"),
  attachment: z.url(),
})

const PayloadItem = z.union([TTextPayload, TAttachmentPayload]).catch(undefined as never)

export const TSendMessageData = z.object({
  label: z.string().optional(),
  payload: z.array(PayloadItem).transform((items) => items.filter(Boolean)),
})

// ─── Predefined Type: addComment ──────────────────────────────────────────────

export const TAddCommentData = z
  .object({ label: z.string().optional(), comment: z.string() })
  .partial()

// ─── Predefined Type: dateTime / businessHours ──────────────────────────────────────────────

const Day = z.preprocess(
  (val) =>
    typeof val === "string" ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : val,
  z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
)

/** "HH:MM" 24-hour time string */
const TimeString = z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")

const TimeSlot = z.object({
  startTime: TimeString,
  endTime: TimeString,
  day: Day,
})

// ─── Per-type data payloads ────────────────────────────────────────────────────

const TriggerData = z
  .object({
    type: z.string(),
    oncePerContact: z.boolean(),
  })
  .partial()

export const TDateTimeData = z
  .object({
    label: z.string().optional(),
    times: z.array(TimeSlot),
    connectors: z.array(NodeId),
    timezone: z.string(), // TODO:
    action: z.string(), // TODO:
  })
  .partial()

const DateTimeConnectorData = z.object({
  connectorType: z.enum(["success", "failure"]),
})

// ─── Per-type node schemas ─────────────────────────────────────────────────────

export const TCommonDataSchema = z.object({
  id: NodeId,
  parentId: NodeId,
  name: z.string().optional(),
  icon: z.string().optional(),
  desc: z.string().optional(),
})

export const TTriggerNodeSchema = TCommonDataSchema.extend({
  type: z.literal("trigger"),
  data: TriggerData,
})

export const TSendMessageNodeSchema = TCommonDataSchema.extend({
  type: z.literal("sendMessage"),
  data: TSendMessageData,
})

export const TDateTimeNodeSchema = TCommonDataSchema.extend({
  type: z.literal("dateTime"),
  data: TDateTimeData,
})

export const TDateTimeConnectorNodeSchema = TCommonDataSchema.extend({
  type: z.literal("dateTimeConnector"),
  data: DateTimeConnectorData,
})

export const TAddCommentNodeSchema = TCommonDataSchema.extend({
  type: z.literal("addComment"),
  data: TAddCommentData,
})

// ─── Union of all node types ───────────────────────────────────────────────────

export const TFlowNodeSchema = z.discriminatedUnion("type", [
  TTriggerNodeSchema,
  TSendMessageNodeSchema,
  TDateTimeNodeSchema,
  TDateTimeConnectorNodeSchema,
  TAddCommentNodeSchema,
])

export const TFlowSchema = z.array(TFlowNodeSchema)

// ─── Inferred TypeScript types ────────────────────────────────────────────────

export type TFlow = z.infer<typeof TFlowSchema>
export type TCommonNodeData = z.infer<typeof TCommonDataSchema>
export type TTriggerNode = z.infer<typeof TTriggerNodeSchema>
export type TSendMessageNode = z.infer<typeof TSendMessageNodeSchema>
export type TDateTimeNode = z.infer<typeof TDateTimeNodeSchema>
export type TDateTimeConnector = z.infer<typeof TDateTimeConnectorNodeSchema>
export type TAddCommentNode = z.infer<typeof TAddCommentNodeSchema>

export type TCustomTypes = TFlow[number]["type"]
// ─── Usage ────────────────────────────────────────────────────────────────────

/**
 * Parse and validate raw API data.
 * Throws a ZodError with full details if the data is invalid.
 *
 * @example
 * const response = await fetch('/api/flow')
 * const data = await response.json()
 * const nodes = parseFlow(data)   // typed as TFlowSchema
 */
export function parseFlow(data: unknown): TFlow {
  return TFlowSchema.parse(data)
}

export function safeParseFlow(data: unknown) {
  return TFlowSchema.safeParse(data)
}

// ─── Displayed Nodes and Edges ────────────────────────────────────────────────

export type TDisplayedNode = {
  id: string
  type: keyof DefaultNodeTypes | TCustomTypes
  customType: TCustomTypes
  position: { x: number; y: number }
  data: TFlow[number]["data"]
}

export type TDisplayedEdge = { id: string; source: string; target: string }

export type TDisplayedGraph = {
  nodes: TDisplayedNode[]
  edges: TDisplayedEdge[]
}
