import type { NodeConfig } from "@/types/nodes"
import {
  AddCommentDataSchema,
  DateTimeConnectorSchema,
  DateTimeDataSchema,
  SendMessageDataSchema,
  type TCustomTypes,
} from "@/types/schemas/dataNodes"
import type { GraphNode } from "@vue-flow/core"

export const nodeConfigs: Partial<Record<TCustomTypes, NodeConfig>> = {
  dateTimeConnector: {
    display: (data) => {
      const parsed = DateTimeConnectorSchema.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return { title: parsed.data.label ?? "" }
    },
  },
  sendMessage: {
    display: (data) => {
      const parsed = SendMessageDataSchema.safeParse(data)
      if (!parsed.success) return { title: "", desc: "" }
      return {
        title: parsed.data.label ?? "",
        desc: parsed.data.payload.find((item) => item.type === "text")?.text ?? "",
      }
    },
    updateInfo: (id, key, value, updateNodeData) =>
      updateNodeData(id, (node: GraphNode) => {
        const parsed = SendMessageDataSchema.safeParse(node.data)
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
      const parsed = AddCommentDataSchema.safeParse(data)
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
      const parsed = DateTimeDataSchema.safeParse(data)
      if (!parsed.success) return { title: "", desc: "", times: [] }
      return {
        title: parsed.data.label ?? "",
        desc: parsed.data.timezone ?? "",
        times: parsed.data.times,
      }
    },
    updateInfo: (id, key, value = "", updateNodeData) => {
      if (key === "title") {
        return updateNodeData(id, { label: value })
      }
      if (key === "times") {
        return updateNodeData(id, { times: value })
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
