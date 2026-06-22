import { QUERY_CONSTANTS } from "@/constants/query"
import type { TDisplayedGraph } from "@/types/nodes"
import { safeParseFlow } from "@/types/schemas/dataNodes"
import { toVueFlow } from "@/utils/nodePositioning"
import { useQuery } from "@tanstack/vue-query"
import { computed } from "vue"

export const useQueryData = () => {
  const fetchInitialNodes = async () => {
    const result = await fetch(
      "https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com/candidate-assessments/payload.json",
      { method: "GET" },
    )
      .then((response) => response.json())
      .catch((error) => console.error(error))
    return result
  }

  const { data } = useQuery({
    ...QUERY_CONSTANTS,
    queryKey: ["dataNodes"],
    queryFn: fetchInitialNodes,
  })

  const initialNodes = computed<TDisplayedGraph>(() => {
    const initialStates: TDisplayedGraph = {
      nodes: [],
      edges: [],
    }

    if (!data.value) return initialStates

    const result = safeParseFlow(data.value)
    if (!result.success) {
      console.error("Flow parse error:", result.error)
      return initialStates
    }

    const { nodes = [], edges = [] } = toVueFlow(result.data)
    return { nodes, edges }
  })

  return {
    fetchInitialNodes,
    initialNodes,
  }
}
