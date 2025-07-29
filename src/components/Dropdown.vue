<script setup>
import { ref, watch, onMounted, onUpdated } from "vue";
import { vOnClickOutside, OnClickOutside } from "@vueuse/components";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "bottom-right",
  },
  top: {
    type: String,
    default: "100%",
  },
  right: {
    type: String,
    default: "0",
  },
  left: {
    type: String,
  },
  bottom: {
    type: String,
  },
});

const emit = defineEmits(['update:open']);

const openDropdown = ref(props.open);
const dropdown = ref(null);

function setRef(el) {
  dropdown.value = el;
}

function toggleDropdown() {
  openDropdown.value = !openDropdown.value;
  emit('update:open', openDropdown.value);
}

function setValue() {
  if (!dropdown.value) return;
  
  if (!openDropdown.value) {
    dropdown.value.style.display = "none";
  } else {
    dropdown.value.style.removeProperty("display");
  }
}

function setStyle() {
  if (!dropdown.value) return;
  
  dropdown.value.style.position = "absolute";
  dropdown.value.style.zIndex = 20;

  dropdown.value.style.setProperty("--top", props.top);
  dropdown.value.style.setProperty("--right", props.right);
  
  if (props.left) {
    dropdown.value.style.setProperty("--left", props.left);
  }
  
  if (props.bottom) {
    dropdown.value.style.setProperty("--bottom", props.bottom);
  }

  setValue();

  if (props.position == "bottom-right") {
    dropdown.value.classList.add("bottom-right");
  }
}

watch(openDropdown, setValue);
watch(props, setStyle);

onMounted(() => {
  // Delay the style setting to ensure the ref is available
  setTimeout(setStyle, 0);
});

onUpdated(() => {
  if (dropdown.value) {
    setStyle();
  }
});

// Expose methods and state to parent component
defineExpose({
  toggleDropdown,
  openDropdown,
});
</script>

<template>
  <OnClickOutside
    :class="[!dropdown ? 'loading-dropdown' : 'dropdown']"
    class="inline-flex relative"
    @trigger="openDropdown = false"
  >
    <slot name="trigger" :toggleDropdown="toggleDropdown" :open="openDropdown"></slot>
    <div ref="dropdown" v-show="openDropdown">
      <slot name="dropdown"></slot>
    </div>
  </OnClickOutside>
</template>

<style>
.loading-dropdown * {
  visibility: hidden;
}

.bottom-right {
  top: var(--top);
  right: var(--right);
}
</style>

