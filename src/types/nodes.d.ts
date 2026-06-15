import type { useVueFlow } from "@vue-flow/core"

type NodeDisplayData = {
  title: string
  desc: string
}

type UpdateNodeDataFn = ReturnType<typeof useVueFlow>["updateNodeData"]

type NodeConfig = {
  display: (data: unknown) => NodeDisplayData
  updateDesc: (id: string, value: string, updateNodeData: UpdateNodeDataFn) => void
}
