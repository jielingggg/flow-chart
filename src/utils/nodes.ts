import type { NodeConfig } from "@/types/nodes"
import {
  TAddCommentData,
  TDateTimeConnectorData,
  TDateTimeData,
  TSendMessageData,
  type TCustomTypes,
} from "@/types/schemas/dataNodes"
import type { GraphNode } from "@vue-flow/core"

export const nodeConfigs: Partial<Record<TCustomTypes, NodeConfig>> = {
  dateTimeConnector: {
    display: (data) => {
      const parsed = TDateTimeConnectorData.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return { title: parsed.data.label ?? "" }
    },
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
    updateInfo: (id, key, value, updateNodeData) =>
      updateNodeData(id, (node: GraphNode) => {
        const parsed = TSendMessageData.safeParse(node.data)
        if (!parsed.success) return node.data

        if (key === "title") {
          return { label: value }
        }

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
    updateInfo: (id, key, value, updateNodeData) => {
      if (key === "title") {
        return updateNodeData(id, { label: value })
      }
      return updateNodeData(id, { comment: value })
    },
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
    updateInfo: (id, key, value = "", updateNodeData) => {
      if (key === "title") {
        return updateNodeData(id, { label: value })
      }
      return updateNodeData(id, { timezone: value })
    },
  },
}

const defaultConfig: NodeConfig = {
  display: () => ({ title: "", desc: "" }),
  updateInfo: (id, key, value, updateNodeData) => updateNodeData(id, { [key]: value }),
}

export const getNodeConfig = (type: string): NodeConfig => {
  return nodeConfigs[type as TCustomTypes] ?? defaultConfig
}
