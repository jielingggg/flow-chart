import type { TDisplayedGraph, TDisplayedNode } from "@/types/nodes"
import { safeParseFlow, type TFlow } from "@/types/schemas/dataNodes"
import { useQuery } from "@tanstack/vue-query"
import type { Edge } from "@vue-flow/core"
import { computed, watch } from "vue"

export const useQueryData = () => {
  const fetchInitialNodes = async () => {
    const result = await fetch(
      "https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com/candidate-assessments/payload.json",
      { method: "GET" },
    )
      .then((response) => response.json())
      .catch((error) => console.error(error))
    console.log("1st result: ", result)
    return result
  }

  const { data } = useQuery({
    queryKey: ["dataNodes"],
    queryFn: fetchInitialNodes,
    // queryFn: () => Promise.resolve(sampleData), // TODO: Use sample data for testing
  })

  const isStartingNode = (node: TFlow[number], data: TFlow): boolean => {
    if (node.parentId === -1) return true
    return !data.some((n) => n.id === node.parentId)
  }

  // const isEndingNode = (node: TFlow[number], data: TFlow): boolean => {
  //   return !data.some((n) => n.parentId === node.id)
  // }

  const toVueFlow = (data: TFlow): TDisplayedGraph => {
    // Build a lookup map: { [id]: node } for quick access by id
    const nodeMap = Object.fromEntries(data.map((n) => [n.id, n]))

    const getDepth = (id: string | number): number => {
      if (id === -1) return -1

      const node = nodeMap[id]
      if (!node || node.parentId === -1) return 0

      return 1 + getDepth(node.parentId)
    }

    // Pre-calculate depth for every node: { [id]: depth }
    const depthById: Record<string, number> = Object.fromEntries(
      data.map((n) => [String(n.id), getDepth(n.id)]),
    )

    // Calculate x position based on parent's x, not global depth index
    const xById: Record<string, number> = {}
    const childrenOf: Record<string, string[]> = {}

    // Group children by parent
    data.forEach((n) => {
      const parentKey = String(n.parentId)
      if (n.parentId === -1) return
      childrenOf[parentKey] = childrenOf[parentKey] ?? []
      childrenOf[parentKey].push(String(n.id))
    })

    // Recursively assign x positions, centering children under their parent
    function assignX(id: string, parentX: number) {
      const children = childrenOf[id] ?? []
      xById[id] = parentX

      const totalWidth = (children.length - 1) * 220
      const startX = parentX - totalWidth / 2

      children.forEach((childId, i) => {
        assignX(childId, startX + i * 220)
      })
    }

    // Start from root nodes (parentId === -1)
    data.filter((n) => isStartingNode(n, data)).forEach((n) => assignX(String(n.id), 0))

    const nodes: TDisplayedNode[] = data.map((n) => {
      const depth = depthById[String(n.id)] ?? 0
      const x = xById[String(n.id)] ?? 0
      const y = depth * 120

      const returnData = {
        ...n,
        id: String(n.id),
        type: (isStartingNode(n, data) ? "input" : n.type) as TDisplayedNode["customType"], // TODO: simplify?
        customType: n.type,
        position: { x, y },
        data: {
          ...n.data,
          label: n.name ?? n.type,
        },
      }

      console.log({ returnData })
      return returnData
    })

    const edges = data
      .filter((n) => !isStartingNode(n, data))
      .map((n) => ({
        id: `e-${n.parentId}-${n.id}`,
        source: String(n.parentId),
        target: String(n.id),
      }))

    return { nodes, edges }
  }

  const initialNodes = computed<{ nodes: TDisplayedNode[]; edges: Edge[] }>(() => {
    // TODO: handle loading and error states
    console.log("result: ", data.value)
    if (!data.value)
      return {
        nodes: [],
        edges: [],
      }

    const result = safeParseFlow(data.value)
    if (!result.success) {
      console.error("Flow parse error:", result.error)
      return {
        nodes: [],
        edges: [],
      }
    }

    const { nodes = [], edges = [] } = toVueFlow(result.data)
    console.log("Parsed nodes and edges:", { nodes, edges })
    return { nodes, edges }
  })

  watch(initialNodes, (newNodes) => {
    console.log("Parsed nodes:", newNodes)
  })

  return {
    fetchInitialNodes,
    initialNodes,
  }
}
