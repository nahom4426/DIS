
<script setup lang="ts">
import icons from "@/utils/icons";
import {
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  type PropType,
} from "vue";

const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "sm",
  },
  type: {
    type: String as PropType<"primary" | "secondary">,
    default: "primary",
  },
});
</script>

<template>
  <button
    v-ripple
    :class="[
      {
        'px-4 py-1 min-w-[3.6rem] min-h-[2rem]': size === 'sm',
        'px-4 py-2 min-w-[6.8rem] min-h-[3rem]': size === 'md',
        'px-6 py-3 min-w-[6.8rem] min-h-[3.625rem]': size === 'lg',
        'bg-primary text-white': type === 'primary',
        'bg-secondary text-white': type === 'secondary',
      }
    ]"
    class="__ripple flex items-center justify-center rounded capitalize transition-colors duration-200 hover:opacity-90"
  >
    <slot v-if="!pending"></slot>
    <p v-else v-html="icons.spinner" class="animate-spin" />
  </button>
</template>
<style module>
.xs {
  width: auto;
  height: auto;
}

.sm {
  min-width: 3.6rem;
  min-height: 2rem;
}

.md {
  min-width: 6.8rem;
  min-height: 3rem;
}

.lg {
  min-width: 6.8rem;
  min-height: 3.625rem;
}

.secondary {
  @apply bg-secondary text-white;
}

.primary {
  @apply bg-primary text-white;
}
</style>
