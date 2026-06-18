import router from "@/router"
import { describe, expect, it } from "vitest"

describe("Router Unit Tests", () => {
  it("should initialize with the home route", async () => {
    await router.push("/")
    await router.isReady()

    expect(router.currentRoute.value.path).toBe("/")
    expect(router.currentRoute.value.name).toBe("home")
  })

  it("should match the home component dynamically on navigation", async () => {
    await router.push("/random")
    await router.isReady()

    await router.push({ name: "home" })
    await router.isReady()

    const matchedRoute = router.currentRoute.value.matched[0]

    expect(matchedRoute).toBeDefined()
    expect(matchedRoute?.path).toBe("/")
    expect(matchedRoute?.name).toBe("home")
  })
})
