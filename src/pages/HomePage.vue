<template>
  <div class="home" style="width: 100vw; height: 100vh">
    <VueFlow :nodes="initialNodes.nodes" :edges="initialNodes.edges">
      <PanelComponent />
      <template #node-dateTime="customNodeProps">
        <CustomNode :type="customNodeProps.type" :data="customNodeProps.data" />
      </template>
      <template #node-sendMessage="customNodeProps">
        <CustomNode :type="customNodeProps.type" :data="customNodeProps.data" />
      </template>
      <template #node-addComment="customNodeProps">
        <CustomNode :type="customNodeProps.type" :data="customNodeProps.data" />
      </template>
      <template #node-dateTimeConnector="customNodeProps">
        <CustomConnector :type="customNodeProps.type" :data="customNodeProps.data" />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import CustomConnector from "@/components/CustomConnector.vue"
import CustomNode from "@/components/CustomNode.vue"
import PanelComponent from "@/components/PanelComponent.vue"
import { useQueryData } from "@/hooks/query"
import { VueFlow } from "@vue-flow/core"
import { onMounted } from "vue"

const { fetchInitialNodes, initialNodes } = useQueryData()

onMounted(async () => {
  await fetchInitialNodes()
})
</script>

<style lang="scss" scoped>
.home {
  background-color: lightyellow;
}
</style>
