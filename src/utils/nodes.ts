import type { NodeConfig } from "@/types/nodes"
import {
  TAddCommentData,
  TDateTimeConnectorData,
  TDateTimeData,
  TSendMessageData,
  type TCustomTypes,
} from "@/types/schemas/dataNodes"
import type { GraphNode } from "@vue-flow/core"

export const editableFieldTypes: Partial<TCustomTypes>[] = ["addComment", "sendMessage", "dateTime"]

export const nodeConfigs: Partial<Record<TCustomTypes, NodeConfig>> = {
  dateTimeConnector: {
    display: (data) => {
      const parsed = TDateTimeConnectorData.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return { title: parsed.data.label ?? "" }
    },
    updateDesc: () => null,
  },
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
