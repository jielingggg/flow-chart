import { z } from "zod"

const NodeIdSchema = z.union([z.number(), z.string()])

// Predefined Type: sendMessage (Payload items)

const TextPayloadSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
})

const AttachmentPayloadSchema = z.object({
  type: z.literal("attachment"),
  attachment: z.url(),
})

const PayloadItemSchema = z
  .union([TextPayloadSchema, AttachmentPayloadSchema])
  .catch(undefined as never)

export const SendMessageDataSchema = z.object({
  label: z.string().optional(),
  payload: z.array(PayloadItemSchema).transform((items) => items.filter(Boolean)),
})

//  Predefined Type: addComment

export const AddCommentDataSchema = z
  .object({ label: z.string().optional(), comment: z.string() })
  .partial()

// Predefined Type: dateTime / businessHours

const DaySchema = z.preprocess(
  (val) =>
    typeof val === "string" ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : val,
  z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
)

const TimeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")

export const TimeSlotSchema = z.array(
  z.object({
    startTime: TimeSchema,
    endTime: TimeSchema,
    day: DaySchema,
  }),
)

export type TTimeSlot = z.infer<typeof TimeSlotSchema>

// Per-type data payloads

const TriggerSchema = z
  .object({
    type: z.string(),
    oncePerContact: z.boolean(),
  })
  .partial()

export const DateTimeDataSchema = z
  .object({
    label: z.string().optional(),
    times: TimeSlotSchema,
    connectors: z.array(NodeIdSchema),
    timezone: z.string().optional(),
    action: z.string().optional(),
  })
  .partial()

export type TDateTimeData = z.infer<typeof DateTimeDataSchema>

export const DateTimeConnectorSchema = z.object({
  label: z.string().optional(),
  connectorType: z.enum(["success", "failure"]),
})

// Per-type node schemas

export const CommonDataSchema = z.object({
  id: NodeIdSchema,
  parentId: NodeIdSchema,
  name: z.string().optional(),
})

export const TriggerNodeSchema = CommonDataSchema.extend({
  type: z.literal("trigger"),
  data: TriggerSchema,
})

export const SendMessageNodeSchema = CommonDataSchema.extend({
  type: z.literal("sendMessage"),
  data: SendMessageDataSchema,
})

export const DateTimeNodeSchema = CommonDataSchema.extend({
  type: z.literal("dateTime"),
  data: DateTimeDataSchema,
})

export const DateTimeConnectorNodeSchema = CommonDataSchema.extend({
  type: z.literal("dateTimeConnector"),
  data: DateTimeConnectorSchema,
})

export const AddCommentNodeSchema = CommonDataSchema.extend({
  type: z.literal("addComment"),
  data: AddCommentDataSchema,
})

// Union of all node types

export const FlowNodeSchema = z.discriminatedUnion("type", [
  TriggerNodeSchema,
  SendMessageNodeSchema,
  DateTimeNodeSchema,
  DateTimeConnectorNodeSchema,
  AddCommentNodeSchema,
])

export const FlowSchema = z.array(FlowNodeSchema)

// Inferred TypeScript types

export type TFlow = z.infer<typeof FlowSchema>
export type TCommonNodeData = z.infer<typeof CommonDataSchema>
export type TTriggerNode = z.infer<typeof TriggerNodeSchema>
export type TSendMessageNode = z.infer<typeof SendMessageNodeSchema>
export type TDateTimeNode = z.infer<typeof DateTimeNodeSchema>
export type TDateTimeConnector = z.infer<typeof DateTimeConnectorNodeSchema>
export type TAddCommentNode = z.infer<typeof AddCommentNodeSchema>

export type TCustomTypes = TFlow[number]["type"]

// Usage

export function parseFlow(data: unknown): TFlow {
  return FlowSchema.parse(data)
}

export function safeParseFlow(data: unknown) {
  return FlowSchema.safeParse(data)
}
