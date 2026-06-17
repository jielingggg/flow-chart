import goldDustIcon from "@/assets/icons/gold-dust.png"
import greenBubbleIcon from "@/assets/icons/green-bubble.png"
import pinkBubbleIcon from "@/assets/icons/pink-bubble.png"
import purpleBubbleIcon from "@/assets/icons/purple-bubble.png"
import type { TCustomTypes } from "@/types/schemas/dataNodes"

export const getNodeIcon = (type: TCustomTypes) => {
  switch (type) {
    case "trigger":
      return greenBubbleIcon
    case "addComment":
      return pinkBubbleIcon
    case "sendMessage":
      return purpleBubbleIcon
    case "dateTime":
      return goldDustIcon
    default:
      return greenBubbleIcon
  }
}
