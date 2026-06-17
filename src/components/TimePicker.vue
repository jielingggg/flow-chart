<template>
  <Listbox as="div" v-model="selected">
    <div class="relative">
      <ListboxButton
        class="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-800/50 py-1.5 pr-2 pl-3 text-left text-white outline-1 -outline-offset-1 outline-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:text-sm/6"
      >
        <span class="col-start-1 row-start-1 flex items-center gap-3 pr-6">
          <span class="block truncate">{{ selected ?? "" }}</span>
        </span>
        <ChevronUpDownIcon
          class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
          aria-hidden="true"
        />
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class=""
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base outline-1 -outline-offset-1 outline-white/10 sm:text-sm"
        >
          <ListboxOption
            as="template"
            v-for="time in selections"
            :key="time"
            :value="time"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-indigo-500 text-white outline-hidden' : 'text-white',
                'relative cursor-default pl-2 pr-2 py-2 select-none justify-items-center w-full',
              ]"
            >
              <span
                :class="[selected ? 'font-bold text-cyan-200' : 'font-normal', 'block truncate']"
                >{{ time }}</span
              >
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { ChevronUpDownIcon } from "@heroicons/vue/16/solid"

defineProps<{ selections: string[] }>()

const selected = defineModel<string>("selected")
</script>
