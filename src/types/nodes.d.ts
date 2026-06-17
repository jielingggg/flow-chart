import type { EDITABLE_FIELD_TYPES } from "@/constants/nodeTypes"
import type { TCustomTypes, TFlow, TTimeSlot } from "@/types/schemas/dataNodes"
import type { useVueFlow } from "@vue-flow/core"

export type TNodeDisplayData = {
  title: string
  desc?: string
  times?: TTimeSlot
}

export type TEditableFieldKeys = keyof TNodeDisplayData
export type TEditableFieldTypes = ReturnType<typeof EDITABLE_FIELD_TYPES>

export type TUpdateNodeDataFn = ReturnType<typeof useVueFlow>["updateNodeData"]

export type NodeConfig = {
  display: (data: unknown) => TNodeDisplayData
  updateInfo?: (
    id: string,
    key: TEditableFieldKeys,
    value: unknown,
    updateNodeData: TUpdateNodeDataFn,
  ) => void
}

// ─── Displayed Nodes and Edges ────────────────────────────────────────────────

export type TDisplayedNode = {
  id: string
  type: TCustomTypes
  position: { x: number; y: number }
  data: TFlow[number]["data"]
}

export type TDisplayedEdge = { id: string; source: string; target: string }

export type TDisplayedGraph = {
  nodes: TDisplayedNode[]
  edges: TDisplayedEdge[]
}
