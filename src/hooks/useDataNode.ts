import { EDITABLE_FIELD_TYPES } from "@/constants/nodeTypes"
import { type TCustomTypes } from "@/types/schemas/dataNodes"
import { getNodeIcon } from "@/utils/defaultData"
import { getNodeConfig } from "@/utils/nodes"
import { useVueFlow, type GraphNode } from "@vue-flow/core"
import { computed } from "vue"

export const useDataNode = (node?: GraphNode) => {
  const { getSelectedNodes, updateNodeData, removeNodes } = useVueFlow()

  const selectedNodes = computed(() => (node ? [node] : (getSelectedNodes.value ?? [])))

  const selectedSingleNode = computed(() => selectedNodes.value[0])
  const showPanel = computed(() => selectedNodes.value.length === 1)

  const nodeType = computed(() => (selectedSingleNode.value?.type ?? "") as TCustomTypes)

  const nodeDisplay = computed(() =>
    getNodeConfig(nodeType.value).display(selectedSingleNode.value?.data),
  )

  const isFieldEditable = computed(() => EDITABLE_FIELD_TYPES.includes(nodeType.value))

  const title = computed({
    get: () => nodeDisplay.value.title,
    set: (value: string) => {
      const id = selectedSingleNode.value?.id
      if (!id) return

      const currentTitle = nodeDisplay.value.title ?? ""
      if (value === currentTitle) return

      getNodeConfig(nodeType.value).updateInfo?.(id, "title", value, updateNodeData)
    },
  })

  const desc = computed({
    get: () => nodeDisplay.value.desc,
    set: (value: string) => {
      const id = selectedSingleNode.value?.id
      if (!id) return

      const currentDesc = nodeDisplay.value.desc ?? ""
      if (value === currentDesc) return

      getNodeConfig(nodeType.value).updateInfo?.(id, "desc", value, updateNodeData)
    },
  })

  const icon = computed(() => getNodeIcon(nodeType.value))

  const onDelete = () => {
    removeNodes(selectedNodes.value)
  }

  return { nodeDisplay, showPanel, icon, title, desc, isFieldEditable, onDelete }
}
