import { type TCustomTypes } from "@/types/schemas/dataNodes"
import { getNodeIcon } from "@/utils/defaultData"
import { editableFieldTypes, getNodeConfig } from "@/utils/nodes"
import { useVueFlow } from "@vue-flow/core"
import { computed } from "vue"

export const useDataNode = () => {
  const { getSelectedNodes, updateNodeData, removeNodes } = useVueFlow()

  const selectedNodes = computed(() => getSelectedNodes.value ?? [])
  const selectedSingleNode = computed(() => selectedNodes.value[0])
  const showPanel = computed(() => selectedNodes.value.length === 1)

  const customType = computed(() => selectedSingleNode.value?.type ?? "")

  const nodeDisplay = computed(() =>
    getNodeConfig(customType.value).display(selectedSingleNode.value?.data),
  )

  const isFieldEditable = computed(() =>
    editableFieldTypes.includes(customType.value as TCustomTypes),
  )

  const title = computed({
    get: () => selectedSingleNode.value?.data.label ?? "",
    set: (value) => {
      if (isFieldEditable.value) {
        updateNodeData(selectedSingleNode.value?.id ?? "0", { label: value })
      }
    },
  })

  const desc = computed({
    get: () => nodeDisplay.value.desc,
    set: (value: string) => {
      const id = selectedSingleNode.value?.id
      if (!id) return
      getNodeConfig(customType.value).updateDesc?.(id, value, updateNodeData)
    },
  })

  const icon = computed(() => getNodeIcon(customType.value as TCustomTypes))

  const onDelete = () => {
    removeNodes(selectedNodes.value)
  }

  return { showPanel, icon, title, desc, isFieldEditable, onDelete }
}
