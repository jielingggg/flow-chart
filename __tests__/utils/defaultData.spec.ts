import goldDustIcon from "@/assets/icons/gold-dust.png"
import greenBubbleIcon from "@/assets/icons/green-bubble.png"
import pinkBubbleIcon from "@/assets/icons/pink-bubble.png"
import purpleBubbleIcon from "@/assets/icons/purple-bubble.png"
import type { TCustomTypes } from "@/types/schemas/dataNodes"
import { getNodeIcon } from "@/utils/defaultData"
import { describe, expect, it } from "vitest"

describe("defaultData Unit Tests", () => {
  describe("getNodeIcon", () => {
    const testCases: {
      type: TCustomTypes
      expectedIcon: string
    }[] = [
      {
        type: "trigger",
        expectedIcon: greenBubbleIcon,
      },
      {
        type: "addComment",
        expectedIcon: pinkBubbleIcon,
      },
      {
        type: "sendMessage",
        expectedIcon: purpleBubbleIcon,
      },
      {
        type: "dateTime",
        expectedIcon: goldDustIcon,
      },
      {
        type: "dateTimeConnector",
        expectedIcon: greenBubbleIcon,
      },
    ]

    it.each(testCases)(
      "when node type is $type, should return $expectedIcon",
      ({ type, expectedIcon }) => {
        const icon = getNodeIcon(type)
        expect(icon).toBe(expectedIcon)
      },
    )
  })
})
