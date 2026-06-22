import CustomConnector from "@/components/CustomConnector.vue"
import type { NodeConfig } from "@/types/nodes"
import { getNodeConfig } from "@/utils/nodes"
import type { NodeProps } from "@vue-flow/core"
import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/utils/nodes", () => ({
  getNodeConfig: vi.fn(),
}))

describe("CustomConnector.vue", () => {
  const mockNodeProps: Partial<NodeProps> = {
    id: "node-1",
    type: "sendMessage",
    position: { x: 0, y: 0 },
    data: { label: "Test Node Data" },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render the title when configuration display yields a valid title", () => {
    const mockConfig: NodeConfig = {
      display: () => ({ title: "Hello Node World", desc: "" }),
      updateInfo: (id, key, value, updateNodeData) => updateNodeData(id, { [key]: value }),
    }

    vi.mocked(getNodeConfig).mockReturnValue(mockConfig)

    const wrapper = mount(CustomConnector, {
      props: {
        type: "sendMessage",
        data: mockNodeProps as NodeProps,
      },
    })

    const container = wrapper.find(".custom-connector")
    expect(container.exists()).toBe(true)

    const titleParagraph = wrapper.find(".title")
    expect(titleParagraph.text()).toBe("Hello Node World")
  })

  it("should NOT render the template wrapper if the title is empty or missing", () => {
    const mockConfig: NodeConfig = {
      display: () => ({ title: "", desc: "" }),
      updateInfo: (id, key, value, updateNodeData) => updateNodeData(id, { [key]: value }),
    }

    vi.mocked(getNodeConfig).mockReturnValue(mockConfig)

    const wrapper = mount(CustomConnector, {
      props: {
        type: "dateTimeConnector",
        data: mockNodeProps as NodeProps,
      },
    })

    expect(wrapper.find(".custom-connector").exists()).toBe(false)
  })

  it("should dynamically trigger getNodeConfig when props change", async () => {
    const initialConfig: NodeConfig = {
      display: () => ({ title: "Initial Title", desc: "" }),
      updateInfo: (id, key, value, updateNodeData) => updateNodeData(id, { [key]: value }),
    }

    const updatedConfig: NodeConfig = {
      display: () => ({ title: "Updated Dynamic Title", desc: "" }),
      updateInfo: (id, key, value, updateNodeData) => updateNodeData(id, { [key]: value }),
    }

    vi.mocked(getNodeConfig).mockReturnValue(initialConfig)

    const wrapper = mount(CustomConnector, {
      props: {
        type: "initialType",
        data: mockNodeProps as NodeProps,
      },
    })

    expect(wrapper.find(".title").text()).toBe("Initial Title")

    // Update the mock value for the second call
    vi.mocked(getNodeConfig).mockReturnValue(updatedConfig)

    await wrapper.setProps({ type: "updatedType" })

    expect(wrapper.find(".title").text()).toBe("Updated Dynamic Title")
    expect(getNodeConfig).toHaveBeenCalledWith("updatedType")
  })
})
