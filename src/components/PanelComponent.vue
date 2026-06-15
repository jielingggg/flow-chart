<template>
  <Panel v-if="showPanel" position="top-right" class="panel">
    <section class="fields">
      <img v-if="icon" :src="icon" alt="icon" />
      <div class="field">
        <label class="label title" for="title">Title:</label>
        <textarea class="text" id="title" v-model="title" />
      </div>
      <div class="field">
        <label class="label desc" for="desc">Desc:</label>
        <textarea class="text" id="desc" v-model="desc" />
      </div>
    </section>

    <section class="bottom">
      <button class="delete" type="button">Delete</button>
    </section>
  </Panel>
</template>

<script setup lang="ts">
import { useDataNode } from "@/hooks/useDataNode"
import { Panel } from "@vue-flow/core"

const { showPanel, icon, title, desc } = useDataNode()
</script>

<style lang="scss" scoped>
.panel {
  margin: 0;
  height: 100%;
  width: 40vw;
  border-left: 0.05rem solid lightgrey;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: scroll;

  .fields {
    padding: 1rem;
    .field {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;

      .text {
        resize: none;
        border: 0.05rem solid lightgrey;
        border-radius: 0.2rem;
        padding: 0.2rem;

        &:focus-visible {
          outline: none;
        }
      }
    }
  }

  .bottom {
    padding: 1rem;
    background-color: lightgrey;
    position: sticky;
    bottom: 0;

    .delete {
      background-color: lightpink;
      width: 100%;
      border: 0.05rem solid lightpink;
      border-radius: 5rem;
      padding: 0.4rem 0.8rem;
    }
  }
}
</style>
