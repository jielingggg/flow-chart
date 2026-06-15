<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" />
    <section class="top-section">
      <img class="icon" :src="icon" alt="icon" />
      <p v-if="data?.title" class="title">{{ data.title }}</p>
    </section>
    <section class="bottom-section">
      <p v-if="data?.desc" class="desc">{{ data.desc }}</p>
    </section>
    <slot />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script lang="ts" setup>
import { getNodeConfig } from "@/hooks/useDataNode"
import { type TCustomTypes } from "@/types/schemas/dataNodes"
import { getNodeIcon } from "@/utils/defaultData"
import { Handle, Position, type NodeProps } from "@vue-flow/core"
import { computed } from "vue"

const props = defineProps<{
  type: string
  data: NodeProps
}>()

const icon = computed(() => getNodeIcon(props.type as TCustomTypes))

const data = computed(() => getNodeConfig(props.type).display(props.data))
</script>

<style lang="scss" scoped>
.custom-node {
  background: white;
  border: 0.08rem solid black;
  border-radius: 0.2rem;
  max-width: 20rem;

  * {
    padding: 0.2rem;
  }

  .top-section {
    display: flex;
    border-bottom: 0.08rem solid black;

    .title {
      word-break: break-word;
    }

    .icon {
      height: 2.4rem;
      width: 2.6rem;
      flex-shrink: 0;
    }
  }

  .bottom-section {
    .desc {
      height: 2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    textarea {
      resize: none;
      line-clamp: 1;
      text-overflow: ellipsis;
    }
  }
}
</style>
