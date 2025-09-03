<script setup lang="ts" generic="T">
import type { PropType } from "vue";

const props = defineProps({
  rowData: {
    type: Array as PropType<T[]>,
    required: true,
  },
  lastCol: { type: Boolean, default: false },
  firstCol: {
    type: Boolean,
    default: false,
  },
  rowKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
  headKeys: {
    type: Array as PropType<string[]>,
    default: [],
  },
  cells: Object as PropType<{ [key: string]: any }>,
});
const emit = defineEmits(["row"]);
</script>

<template>
  <tr
    v-for="(row, index) in rowData"
    :key="row.id"  
    @click="emit('row', row)"
    class="bg-white border-b hover:bg-gray-50 transition-colors duration-150 ease-in-out h-10"
  >
    <td v-if="firstCol" class="p-2">
      <slot name="select" :row="row" />
    </td>
    <td class="p-4 font-medium text-base-clr">{{ index + 1 }}</td>
    <td
      class="p-2 py-4 font-medium max-w-40 text-base-clr text-ellipsis overflow-hidden whitespace-nowrap"
      :key="key"
      v-for="key in rowKeys"
    >
      <span v-if="!Object.keys(cells || {}) || !cells?.[key]">
        {{
          key.split(".").reduce((all: any, el: string) => {
            return all?.[el];
          }, row)
        }}
      </span>
      <component
        v-else-if="Object.keys(cells || {}) && cells[key].__hmrId"
        :row="row"
        :is="cells[key]"
      />
      <span v-else-if="typeof cells[key] == 'function'">
        {{ cells[key](row?.[key], row) }}
      </span>
    </td>
    <td v-if="lastCol" class="">
      <slot name="lastCol" :row="row" />
    </td>
    <td
      class="p-3"
      v-if="headKeys.find((head) => head.toLowerCase() == 'actions')"
    >
      <slot name="actions" :row="row" />
    </td>
    <td
      class="p-3"
      v-if="headKeys.find((head) => head.toLowerCase() == 'reason')"
    >
      <slot name="reason" :row="row" />
    </td>
  </tr>
</template>