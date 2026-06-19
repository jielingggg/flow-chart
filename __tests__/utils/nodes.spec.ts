import { describe, it, expect, vi } from "vitest"
import type { GraphNode } from "@vue-flow/core"
import { getNodeConfig, nodeConfigs } from "@/utils/nodes"

describe("nodeConfigs Unit Tests", () => {
  // Helper to quickly create a mock updateNodeData function
  const createMockUpdateFn = () =>
    vi.fn((id, payload) => {
      if (typeof payload === "function") {
        // Simulate passing a mock node object to functional updates
        const mockNode = {
          data: { label: "old", payload: [{ type: "text", text: "old-text" }] },
        } as unknown as GraphNode
        return payload(mockNode)
      }
      return payload
    })

  describe("getNodeConfig Fallback", () => {
    it("should return custom config if type exists", () => {
      const config = getNodeConfig("sendMessage")
      expect(config).toBe(nodeConfigs.sendMessage)
    })

    it("should return default config if type does not exist", () => {
      const config = getNodeConfig("nonExistentType")
      expect(config.display({})).toStrictEqual({ title: "", desc: "" })

      const mockUpdate = vi.fn()
      config.updateInfo!("node-1", "title", "newValue", mockUpdate)
      expect(mockUpdate).toHaveBeenCalledWith("node-1", { title: "newValue" })
    })
  })

  describe("dateTimeConnector", () => {
    const config = nodeConfigs.dateTimeConnector!

    it("should display correctly on successful schema parsing", () => {
      const result = config.display({ label: "Connect Standard", connectorType: "success" })
      expect(result).toStrictEqual({ title: "Connect Standard" })
    })

    it("should handle empty label fallback", () => {
      const result = config.display({ label: undefined, connectorType: "success" })
      expect(result).toStrictEqual({ title: "" })
    })

    it("should return empty fields if parsing fails", () => {
      // Assuming invalid format triggers a Zod parsing failure
      const result = config.display({ invalidField: 123 })
      expect(result).toStrictEqual({ title: "" })
    })
  })

  describe("sendMessage", () => {
    const config = nodeConfigs.sendMessage!

    describe("display", () => {
      it("should extract title and description text correctly", () => {
        const result = config.display({
          label: "Send Alert",
          payload: [{ type: "text", text: "Hello World" }],
        })
        expect(result).toStrictEqual({ title: "Send Alert", desc: "Hello World" })
      })

      it("should return empty description if text payload type is missing", () => {
        const result = config.display({
          label: "Send Image",
          payload: [{ type: "image", url: "test.png" }],
        })
        expect(result).toStrictEqual({ title: "Send Image", desc: "" })
      })
    })

    describe("updateInfo", () => {
      it("should return updated label when key is title", () => {
        const updateNodeData = createMockUpdateFn()
        const result = config.updateInfo!("1", "title", "New Title", updateNodeData)
        expect(result).toStrictEqual({ label: "New Title" })
      })

      it("should update text item inside payload when key is not title", () => {
        const updateNodeData = createMockUpdateFn()
        const result = config.updateInfo!("1", "times", "Updated Text", updateNodeData)
        expect(result).toStrictEqual({
          payload: [{ type: "text", text: "Updated Text" }],
        })
      })

      it("should bypass update and return node data if parsing fails", () => {
        const updateNodeData = vi.fn((id, callback) => {
          const corruptedNode = { data: { corrupted: true } } as unknown as GraphNode
          return callback(corruptedNode)
        })
        const result = config.updateInfo!("1", "title", "Boom", updateNodeData)
        expect(result).toStrictEqual({ corrupted: true })
      })
    })
  })

  describe("addComment", () => {
    const config = nodeConfigs.addComment!

    it("should display comment configurations", () => {
      const result = config.display({ label: "Dev Note", comment: "Fix this" })
      expect(result).toStrictEqual({ title: "Dev Note", desc: "Fix this" })
    })

    it("should trigger direct updates for title and description", () => {
      const updateNodeData = vi.fn()

      config.updateInfo!("2", "title", "New Comment Label", updateNodeData)
      expect(updateNodeData).toHaveBeenCalledWith("2", { label: "New Comment Label" })

      config.updateInfo!("2", "desc", "New Body", updateNodeData)
      expect(updateNodeData).toHaveBeenCalledWith("2", { comment: "New Body" })
    })
  })

  describe("dateTime", () => {
    const config = nodeConfigs.dateTime!

    it("should display dynamic times array details", () => {
      const result = config.display({
        label: "Schedule",
        timezone: "UTC",
        times: [
          {
            startTime: "00:00",
            endTime: "23:30",
            day: "Mon",
          },
        ],
      })
      expect(result).toStrictEqual({
        title: "Schedule",
        desc: "UTC",
        times: [
          {
            day: "Mon",
            endTime: "23:30",
            startTime: "00:00",
          },
        ],
      })
    })

    it("should update title, times, and timezone dynamically", () => {
      const updateNodeData = vi.fn()

      config.updateInfo!("3", "title", "New Schedule", updateNodeData)
      expect(updateNodeData).toHaveBeenCalledWith("3", { label: "New Schedule" })

      config.updateInfo!("3", "times", ["15:00"], updateNodeData)
      expect(updateNodeData).toHaveBeenCalledWith("3", { times: ["15:00"] })

      config.updateInfo!("3", "desc", "EST", updateNodeData)
      expect(updateNodeData).toHaveBeenCalledWith("3", { timezone: "EST" })
    })
  })
})
