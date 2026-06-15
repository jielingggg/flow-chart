<template>
  <div v-if="info?.title" class="custom-connector">
    <p class="title">{{ info.title }}</p>
  </div>
</template>

<script lang="ts" setup>
import { getNodeConfig } from "@/utils/nodes"
import { type NodeProps } from "@vue-flow/core"
import { computed } from "vue"

const props = defineProps<{
  type: string
  data: NodeProps
}>()

const info = computed(() => getNodeConfig(props.type).display(props.data))
</script>

<style lang="scss" scoped>
.custom-connector {
  background: lightblue;
  border: 0.08rem solid blue;
  border-radius: 1rem;
  padding: 0.1rem 0.2rem;

  .title {
    color: blue;
    font-size: 0.5rem;
    word-break: break-word;
  }
}
</style>
