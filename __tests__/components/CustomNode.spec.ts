import CustomNode from "@/components/CustomNode.vue" // Adjust path to your component
import { useDataNode } from "@/hooks/useDataNode"
import type { GraphNode } from "@vue-flow/core"
import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"

// 1. Mock your custom hook module
vi.mock("@/hooks/useDataNode", () => ({
  useDataNode: vi.fn(),
}))

// 2. Mock Vue Flow core so hooks and template handles return valid, isolated objects
vi.mock("@vue-flow/core", () => ({
  useNode: () => ({
    node: { id: "node-1", type: "custom" } as unknown as GraphNode,
  }),
  // Simple stubs for components so they parse safely in the virtual template
  Handle: { template: "<div class='mock-handle'><slot /></div>" },
  Position: {
    Top: "top",
    Bottom: "bottom",
  },
}))

describe("CustomNode.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render title, description, and icon when all hook data values are provided", () => {
    // Arrange: Setup fully typed reactive return values for the custom hook
    vi.mocked(useDataNode).mockReturnValue({
      title: "Send Payload Alert",
      desc: "Trigger text contents description",
      icon: "https://example.com",
      // Add other properties if your hook returns more (like loading, raw records etc.)
    } as ReturnType<typeof useDataNode>)

    // Act: Mount the node
    const wrapper = mount(CustomNode)

    // Assert: Verify core elements render correctly
    expect(wrapper.find(".title").text()).toBe("Send Payload Alert")
    expect(wrapper.find(".desc").text()).toBe("Trigger text contents description")

    const iconImage = wrapper.find(".s-icon")
    expect(iconImage.exists()).toBe(true)
    expect(iconImage.attributes("src")).toBe("https://example.com")

    // Confirm bottom structural section container is visible
    expect(wrapper.find(".bottom-section").exists()).toBe(true)
  })

  it("should completely hide the description section if desc is an empty string", () => {
    // Arrange: Provide an empty description string
    vi.mocked(useDataNode).mockReturnValue({
      title: "Minimal Node",
      desc: "",
      icon: "https://example.com",
    } as ReturnType<typeof useDataNode>)

    // Act: Mount the node
    const wrapper = mount(CustomNode)

    // Assert: Title should display, but bottom layout wrapper must be unmounted via v-if
    expect(wrapper.find(".title").text()).toBe("Minimal Node")
    expect(wrapper.find(".bottom-section").exists()).toBe(false)
    expect(wrapper.find(".desc").exists()).toBe(false)
  })

  it("should hide the title paragraph if title string is missing but still render the icon", () => {
    // Arrange: Provide no title string
    vi.mocked(useDataNode).mockReturnValue({
      title: "",
      desc: "Isolated Description",
      icon: "https://example.com",
    } as ReturnType<typeof useDataNode>)

    // Act: Mount the node
    const wrapper = mount(CustomNode)

    // Assert: Check structure
    expect(wrapper.find(".title").exists()).toBe(false)
    expect(wrapper.find(".s-icon").attributes("src")).toBe("https://example.com")
    expect(wrapper.find(".desc").text()).toBe("Isolated Description")
  })
})
