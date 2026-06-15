import type { NodeConfig } from "@/types/nodes"
import {
  TAddCommentData,
  TDateTimeData,
  TSendMessageData,
  type TCustomTypes,
} from "@/types/schemas/dataNodes"
import { useVueFlow, type GraphNode } from "@vue-flow/core"
import { computed } from "vue"

export const nodeConfigs: Partial<Record<TCustomTypes, NodeConfig>> = {
  sendMessage: {
    display: (data) => {
      const parsed = TSendMessageData.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return {
        title: parsed.data.label ?? "",
        desc: parsed.data.payload.find((item) => item.type === "text")?.text ?? "",
      }
    },
    updateDesc: (id, value, updateNodeData) =>
      updateNodeData(id, (node: GraphNode) => {
        const parsed = TSendMessageData.safeParse(node.data)
        if (!parsed.success) return node.data
        return {
          payload: parsed.data.payload.map((item) =>
            item.type === "text" ? { ...item, text: value } : item,
          ),
        }
      }),
  },
  addComment: {
    display: (data) => {
      const parsed = TAddCommentData.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return {
        title: parsed.data.label ?? "",
        desc: parsed.data.comment ?? "",
      }
    },
    updateDesc: (id, value, updateNodeData) => updateNodeData(id, { comment: value }),
  },
  dateTime: {
    display: (data) => {
      const parsed = TDateTimeData.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return {
        title: parsed.data.label ?? "",
        desc: parsed.data.timezone ?? "",
      }
    },
    updateDesc: (id, value, updateNodeData) => updateNodeData(id, { timezone: value }),
  },
}

const defaultConfig: NodeConfig = {
  display: () => ({ title: "", desc: "" }),
  updateDesc: (id, value, updateNodeData) => updateNodeData(id, { desc: value }),
}

export const getNodeConfig = (type: string): NodeConfig => {
  return nodeConfigs[type as TCustomTypes] ?? defaultConfig
}

export const useDataNode = () => {
  const { getSelectedNodes, updateNodeData } = useVueFlow()

  const selectedNodes = computed(() => getSelectedNodes.value ?? [])
  const selectedSingleNode = computed(() => selectedNodes.value[0])
  const showPanel = computed(() => selectedNodes.value.length === 1)

  const customType = computed(() => selectedSingleNode.value?.type ?? "")

  const nodeDisplay = computed(() =>
    getNodeConfig(customType.value).display(selectedSingleNode.value?.data),
  )

  const title = computed({
    get: () => selectedSingleNode.value?.data.label ?? "",
    set: (value) => updateNodeData(selectedSingleNode.value?.id ?? "0", { label: value }),
  })

  const desc = computed({
    get: () => nodeDisplay.value.desc,
    set: (value: string) => {
      const id = selectedSingleNode.value?.id
      if (!id) return
      getNodeConfig(customType.value).updateDesc(id, value, updateNodeData)
    },
  })

  const icon = computed(() => selectedSingleNode.value?.data.icon ?? "")

  return { showPanel, icon, title, desc }
}
