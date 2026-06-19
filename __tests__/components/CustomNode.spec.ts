import CustomNode from "@/components/CustomNode.vue"
import { useDataNode } from "@/hooks/useDataNode"
import { mockDataNode } from "@test/mock/useDataNodeMock"
import type { GraphNode } from "@vue-flow/core"
import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/hooks/useDataNode", () => ({
  useDataNode: vi.fn(),
}))

const mockUseDataNode = vi.mocked(useDataNode)

vi.mock("@vue-flow/core", () => ({
  useNode: () => ({
    node: { id: "node-1", type: "custom" } as unknown as GraphNode,
  }),
  Handle: { template: "<div class='mock-handle'><slot /></div>" },
  Position: {
    Top: "top",
    Bottom: "bottom",
  },
}))

describe("CustomNode.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseDataNode.mockReturnValue(mockDataNode())
  })

  it("should render title, description, and icon when all hook data values are provided", () => {
    mockUseDataNode.mockReturnValue(
      mockDataNode({
        title: "Send Payload Alert",
        desc: "Trigger text contents description",
        icon: "https://example.com",
      }),
    )

    const wrapper = mount(CustomNode)

    expect(wrapper.find(".title").text()).toBe("Send Payload Alert")
    expect(wrapper.find(".desc").text()).toBe("Trigger text contents description")

    const iconImage = wrapper.find(".s-icon")
    expect(iconImage.exists()).toBe(true)
    expect(iconImage.attributes("src")).toBe("https://example.com")

    expect(wrapper.find(".bottom-section").exists()).toBe(true)
  })

  it("should completely hide the description section if desc is an empty string", () => {
    mockUseDataNode.mockReturnValue(mockDataNode({ title: "Minimal Node" }))

    const wrapper = mount(CustomNode)

    expect(wrapper.find(".title").text()).toBe("Minimal Node")
    expect(wrapper.find(".bottom-section").exists()).toBe(false)
    expect(wrapper.find(".desc").exists()).toBe(false)
  })

  it("should hide the title paragraph if title string is missing but still render the icon", () => {
    mockUseDataNode.mockReturnValue(
      mockDataNode({
        title: "",
        desc: "Isolated Description",
        icon: "https://example.com",
      }),
    )

    const wrapper = mount(CustomNode)

    expect(wrapper.find(".title").exists()).toBe(false)
    expect(wrapper.find(".s-icon").attributes("src")).toBe("https://example.com")
    expect(wrapper.find(".desc").text()).toBe("Isolated Description")
  })
})
