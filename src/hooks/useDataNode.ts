import { EDITABLE_FIELD_TYPES } from "@/constants/nodeTypes"
import type { TEditableFieldTypes } from "@/types/nodes"
import { TimeSlotSchema, type TCustomTypes } from "@/types/schemas/dataNodes"
import { getNodeIcon } from "@/utils/defaultData"
import { getNodeConfig } from "@/utils/nodes"
import { useVueFlow, type GraphNode } from "@vue-flow/core"
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

export const useDataNode = (node?: GraphNode) => {
  const { getSelectedNodes, updateNodeData, removeNodes, onNodeClick, onPaneClick, findNode } =
    useVueFlow()

  const router = useRouter()
  const route = useRoute()

  onNodeClick(({ node }) => {
    router.replace({ query: { ...route.query, nodeId: node.id } })
  })

  onPaneClick(() => {
    const query = { ...route.query }
    delete query.nodeId
    router.replace({ query })
  })

  const selectedSingleNode = computed(() => {
    if (node) return node

    const nodeId = (route.query.nodeId ?? "") as string
    if (!nodeId) {
      return
    }

    const nodeFromUrl = findNode(nodeId)
    return nodeFromUrl
  })

  const nodeType = computed(() => (selectedSingleNode.value?.type ?? "") as TCustomTypes)

  const showPanel = computed(
    () => selectedSingleNode.value && nodeType.value !== "dateTimeConnector",
  )

  const nodeDisplay = computed(() =>
    getNodeConfig(nodeType.value).display(selectedSingleNode.value?.data),
  )

  const isFieldEditable = computed(() =>
    EDITABLE_FIELD_TYPES.includes(nodeType.value as TEditableFieldTypes),
  )

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

  const dateTime = computed(() => nodeDisplay.value.times)

  const updateTime = (index: number, key: "startTime" | "endTime", value?: string) => {
    const id = selectedSingleNode.value?.id
    if (!id || !value) return

    const updatedTimes = [...(nodeDisplay.value.times ?? [])]
    const { success, data } = TimeSlotSchema.safeParse(updatedTimes)
    if (!success || !data.length) return

    const target = data[index]
    if (!target) return // guards against out-of-bounds index

    updatedTimes[index] = { ...target, [key]: value }
    getNodeConfig(nodeType.value).updateInfo?.(id, "times", updatedTimes, updateNodeData)
  }

  const icon = computed(() => getNodeIcon(nodeType.value))

  const onDelete = () => {
    removeNodes(getSelectedNodes.value)
  }

  return { showPanel, icon, title, desc, dateTime, updateTime, isFieldEditable, onDelete }
}
