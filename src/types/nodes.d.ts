import type { TCustomTypes, TFlow } from "@/types/schemas/dataNodes"
import type { useVueFlow } from "@vue-flow/core"

export type TNodeDisplayData = {
  title: string
  desc?: string
}

export type TEditableFieldKeys = keyof TNodeDisplayData

export type TUpdateNodeDataFn = ReturnType<typeof useVueFlow>["updateNodeData"]

export type NodeConfig = {
  display: (data: unknown) => TNodeDisplayData
  updateInfo?: (
    id: string,
    key: TEditableFieldKeys,
    value: string,
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
