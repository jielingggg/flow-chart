import { NODE_HEIGHT, NODE_WIDTH } from "@/constants/nodeTypes"
import type { TFlow } from "@/types/schemas/dataNodes"
import dagre from "@dagrejs/dagre"
import type { Edge, Node } from "@vue-flow/core"

export const toVueFlow = (data: TFlow): { nodes: Node[]; edges: Edge[] } => {
  // ── 1. Separate connector nodes from renderable nodes ──────────────────────
  const connectorIds = new Set(
    data.filter((n) => n.type === "dateTimeConnector").map((n) => String(n.id)),
  )

  const renderableNodes = data.filter((n) => n.type !== "dateTimeConnector")

  // ── 2. Index all nodes by id for O(1) lookup ───────────────────────────────
  const byId = Object.fromEntries(data.map((n) => [String(n.id), n]))

  // ── 3. Build Vue Flow nodes ────────────────────────────────────────────────
  const nodes: Node[] = renderableNodes.map((n) => ({
    id: String(n.id),
    type: n.type,
    position: { x: 0, y: 0 },
    label: n.name ?? n.type,
    data: {
      ...n.data,
      label: n.name ?? n.type,
    },
  }))

  // ── 4. Build Vue Flow edges (skip-through connectors become edge labels) ───
  const edges: Edge[] = []
  let edgeCounter = 1

  renderableNodes.forEach((node) => {
    const sourceId = String(node.id)

    const directChildren = data.filter((n) => String(n.parentId) === sourceId)

    directChildren.forEach((child) => {
      const childId = String(child.id)

      if (connectorIds.has(childId)) {
        const connectorData = byId[childId]?.data as { connectorType?: string } | undefined
        const grandchildren = data.filter((n) => String(n.parentId) === childId)

        grandchildren.forEach((gc) => {
          if (!connectorIds.has(String(gc.id))) {
            edges.push({
              id: `e${edgeCounter++}`,
              source: sourceId,
              target: String(gc.id),
              label: child.name ?? connectorData?.connectorType ?? undefined,
              type: "smoothstep",
            })
          }
        })
      } else {
        edges.push({
          id: `e${edgeCounter++}`,
          source: sourceId,
          target: childId,
          type: "smoothstep",
        })
      }
    })
  })

  // ── 5. Run dagre layout ────────────────────────────────────────────────────
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 60 })

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  edges.forEach((edge) => {
    graph.setEdge(String(edge.source), String(edge.target))
  })

  dagre.layout(graph)

  // ── 6. Apply dagre positions back to nodes ─────────────────────────────────
  const layoutedNodes = nodes.map((node) => {
    const { x, y } = graph.node(node.id)
    return {
      ...node,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
