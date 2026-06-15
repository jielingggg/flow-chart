import type { TCustomTypes, TFlow } from "@/types/schemas/dataNodes"
import type { DefaultNodeTypes, useVueFlow } from "@vue-flow/core"

export type TNodeDisplayData = {
  title: string
  desc?: string
}

export type TUpdateNodeDataFn = ReturnType<typeof useVueFlow>["updateNodeData"]

export type NodeConfig = {
  display: (data: unknown) => TNodeDisplayData
  updateDesc?: (id: string, value: string, updateNodeData: TUpdateNodeDataFn) => void
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
