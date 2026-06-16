<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" />

    <section class="top-section">
      <img class="s-icon" :src="icon" alt="icon" />
      <p v-if="title" class="title">{{ title }}</p>
    </section>

    <section v-if="desc" class="bottom-section">
      <p class="desc">{{ desc }}</p>
    </section>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script lang="ts" setup>
import { useDataNode } from "@/hooks/useDataNode"
import { Handle, Position, useNode } from "@vue-flow/core"

const { node } = useNode()

const { title, desc, icon } = useDataNode(node)
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

    .title {
      word-break: break-word;
    }
  }

  .bottom-section {
    border-top: 0.08rem solid black;

    .desc {
      height: 2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
