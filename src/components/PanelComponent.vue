<template>
  <Panel v-if="showPanel" position="top-right" class="panel">
    <section class="fields">
      <img v-if="icon" class="s-icon" :src="icon" alt="icon" />

      <div class="field">
        <label class="label title" for="title">Title:</label>
        <textarea class="text" id="title" v-model="title" :readonly="!isFieldEditable" />
      </div>

      <div class="field">
        <label class="label desc" for="desc">Desc:</label>
        <textarea class="text" id="desc" v-model="desc" :readonly="!isFieldEditable" />
      </div>

      <div class="field" v-if="dateTime?.length">
        <p class="mb-2">Operating Hour:</p>
        <div class="date-time mb-1" v-for="(data, index) in dateTime" :key="data.day">
          <p>{{ data.day }}</p>
          <TimePicker
            v-model:selected="data.startTime"
            :selections="TIMES"
            @update:selected="(val) => updateTime(index, 'startTime', val)"
          />
          <p>to</p>
          <TimePicker
            v-model:selected="data.endTime"
            :selections="TIMES"
            @update:selected="(val) => updateTime(index, 'endTime', val)"
          />
        </div>
      </div>
    </section>

    <section class="bottom">
      <button class="delete" type="button" @click="onDelete">Delete</button>
    </section>
  </Panel>
</template>

<script setup lang="ts">
import { TIMES } from "@/constants/time.ts"
import { useDataNode } from "@/hooks/useDataNode"
import { Panel } from "@vue-flow/core"
import TimePicker from "./TimePicker.vue"

const { showPanel, icon, title, desc, dateTime, updateTime, isFieldEditable, onDelete } =
  useDataNode()
</script>

<style lang="scss" scoped>
.panel {
  margin: 0;
  height: 100%;
  width: fit-content;
  min-width: 30vw;
  max-width: 80vw;
  border-left: 0.05rem solid lightgrey;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: scroll;

  .fields {
    padding: 1rem;

    .s-icon {
      margin-bottom: 1rem;
    }

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

      .date-time {
        display: grid;
        align-items: center;
        grid-template-columns: 0.8fr 1fr 0.6fr 1fr;
        gap: 0.2rem;

        p {
          text-align: center;
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
