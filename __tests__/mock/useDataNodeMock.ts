import type { useDataNode } from "@/hooks/useDataNode"
import { vi } from "vitest"
import { computed, ref } from "vue"

export const mockDataNode = (
  overrides: {
    title?: string
    desc?: string
    icon?: string
  } = {},
) => {
  const _title = ref(overrides.title ?? "")
  const _desc = ref(overrides.desc ?? "")

  return {
    title: computed({
      get: () => _title.value,
      set: (v: string) => {
        _title.value = v
      },
    }),
    desc: computed({
      get: () => _desc.value,
      set: (v: string) => {
        _desc.value = v
      },
    }),
    icon: computed(() => overrides.icon ?? ""),
    showPanel: computed(() => true),
    dateTime: computed(() => []),
    updateTime: vi.fn(),
    isFieldEditable: computed(() => true),
    onDelete: vi.fn(),
  } satisfies ReturnType<typeof useDataNode>
}
