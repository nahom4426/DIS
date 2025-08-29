<script setup>
import navs from "@/config/navs";
import icons  from "@/utils/icons";
import { useAuthStore } from "@/stores/auth";
import { useColorStore } from "@/stores/colorStore";
import { ref, computed, defineProps, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";

const auth = useAuthStore();

const expandedMenus = ref([]);
function handleSingleItemClick() {}
const props = defineProps({
  isCollapsed: Boolean,
  toggleSidebar: Function,
});
const emit = defineEmits(["toggle-sidebar", "toggle-menu"]);

const userData = computed(() => auth.auth || []);
const hasPrivilege = (requiredPrivileges) => {
  if (!requiredPrivileges || requiredPrivileges.length === 0) return true;
  const userPrivileges = userData.value.privileges || [];

  const userRole = userData.value.roleName;
  return (
    userRole === "SuperAdmin" ||
    userPrivileges.includes("All Privileges") ||
    requiredPrivileges.some((priv) => userPrivileges.includes(priv))
  );
};

const filteredNavs = computed(() => {
  return navs
    .map((item) => {
      if (item.navs) {
        const filteredChildren = item.navs.filter((child) =>
          hasPrivilege(child.privilege)
        );
        return hasPrivilege(item.privilege) || filteredChildren.length > 0
          ? { ...item, navs: filteredChildren }
          : null;
      }
      return hasPrivilege(item.privilege) ? item : null;
    })
    .filter(Boolean);
});

const toggleMenu = (name) => {
  // if (props.isCollapsed || isMobile.value) props.toggleSidebar();
  expandedMenus.value = expandedMenus.value.includes(name)
    ? expandedMenus.value.filter((n) => n !== name)
    : [name];
  emit("toggle-menu", name);
};
</script>

<template>
  <div
    :class="[
      'h-full rounded-2xl bg-white transition-all duration-300 flex flex-col relative',
      props.isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Standard Collapse Button -->
    <button
      @click="props.toggleSidebar(!isCollapsed)"
      class="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:bg-gray-50"
      :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <i 
        v-html="icons.chevron_left" 
        :class="isCollapsed ? 'rotate-180' : ''"
        class="text-gray-600 text-sm transition-transform duration-200"
      ></i>
    </button>

    <!-- Logo Section -->
    <div class="space-y-4 flex-shrink-0">
      <div :class="[
        'flex gap-2 py-4 items-center',
        props.isCollapsed ? 'justify-center px-2' : 'justify-start px-4'
      ]">
        <img
          class="w-13 h-14 flex-shrink-0"
          src="/src/assets/EDIS.png"
          alt="DIS Logo"
        />
        <div v-if="!props.isCollapsed" class="flex flex-col items-start leading-tight">
  <span class="text-xs font-semibold uppercase tracking-wide text-primary">
    Ethiopian Drug
  </span>
  <span class="text-xs font-semibold uppercase tracking-wide text-primary">
    Information System
  </span>
</div>

    
      </div>
      <div class="border-b border-[#F6F7FA]"></div>
    </div>

    <!-- Navigation Menu -->
    <div
      :class="[
        'flex-1 text-base-clr overflow-y-auto',
        props.isCollapsed ? 'px-2' : 'px-4'
      ]"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <div class="flex flex-col gap-2">
        <template v-for="item in filteredNavs" :key="item.name || item.path">
          <!-- Menu items with children -->
          <template v-if="item.navs && item.navs.length">
            <button
              @click="toggleMenu(item.name)"
              :class="[
                'flex items-center h-12 rounded-lg transition-all duration-200 group',
                props.isCollapsed ? 'justify-center px-2' : 'justify-between px-3',
                expandedMenus.includes(item.name) && !props.isCollapsed ? 'bg-[#DFF1F1]' : 'hover:bg-gray-100'
              ]"
              :title="props.isCollapsed ? item.name : ''"
            >
              <span :class="[
                'flex items-center',
                props.isCollapsed ? 'justify-center' : 'gap-3'
              ]">
                <i v-html="item.icon" class="text-lg flex-shrink-0"></i>
                <span
                  v-if="!props.isCollapsed"
                  class="text-sm font-medium whitespace-nowrap"
                >{{ item.name }}</span>
              </span>
              <i
                v-if="!props.isCollapsed"
                v-html="icons.chevron_down"
                :class="{ 'rotate-180': expandedMenus.includes(item.name) }"
                class="transition-transform duration-200 flex-shrink-0"
              />
            </button>

            <!-- Submenu items -->
            <div
              v-if="!props.isCollapsed"
              v-show="expandedMenus.includes(item.name)"
              class="ml-6 space-y-1 border-l border-gray-200 pl-3"
            >
              <RouterLink
                v-for="child in item.navs"
                :key="child.path"
                :to="child.path"
                :class="[
                  'flex items-center h-10 px-3 rounded-lg hover:bg-secondary/20 transition-colors group',
                  'router-link-active:bg-primary router-link-active:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <i v-html="child.icon" class="text-base flex-shrink-0"></i>
                  <span class="text-sm font-medium whitespace-nowrap">{{ child.name }}</span>
                </span>
              </RouterLink>
            </div>
          </template>

           <!-- Single menu items -->
          <template v-else>
            <RouterLink
              :to="item.path"
              @click="handleSingleItemClick"
              :class="[
                'flex items-center h-12 rounded-lg hover:bg-secondary transition-all duration-200 group',
                props.isCollapsed ? 'justify-center px-2' : 'px-3',
                'router-link-active:bg-primary router-link-active:text-white'
              ]"
              :title="props.isCollapsed ? item.name : ''"
            >
              <span :class="[
                'flex items-center',
                props.isCollapsed ? 'justify-center' : 'gap-3'
              ]">
                <i v-html="item.icon" class="text-lg flex-shrink-0"></i>
                <span
                  v-if="!props.isCollapsed"
                  class="text-sm font-medium whitespace-nowrap"
                >{{ item.name }}</span>
              </span>
            </RouterLink>
          </template>
          <!-- Single menu items -->
          <template v-else>
            <RouterLink
              :to="item.path"
              @click="handleSingleItemClick"
              :class="[
                'flex items-center h-12 rounded-lg hover:bg-secondary transition-all duration-200 group',
                props.isCollapsed ? 'justify-center px-2' : 'px-3',
                'router-link-active:bg-primary router-link-active:text-white'
              ]"
              :title="props.isCollapsed ? item.name : ''"
            >
              <span :class="[
                'flex items-center',
                props.isCollapsed ? 'justify-center' : 'gap-3'
              ]">
                <i v-html="item.icon" class="text-lg flex-shrink-0"></i>
                <span
                  v-if="!props.isCollapsed"
                  class="text-sm font-medium whitespace-nowrap"
                >{{ item.name }}</span>
              </span>
            </RouterLink>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-primary text-white border-primary shadow-sm;
}

.router-link-active i {
  @apply text-white;
}

/* Enhanced scrollbar styling */
div::-webkit-scrollbar {
  width: 4px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

div::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Smooth transitions for child items */
.child-items-enter-active,
.child-items-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.child-items-enter-from,
.child-items-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.child-items-enter-to,
.child-items-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;
}

/* Hover effects */
.group:hover i {
  @apply scale-105;
  transition: transform 0.2s ease;
}

/* Focus states for accessibility */
button:focus,
a:focus {
  @apply outline-none ring-2 ring-primary/20 ring-offset-2;
}

/* Hide scrollbar */
div::-webkit-scrollbar {
  display: none;
}

i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 767px) {
  .__drawer {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .__drawer:not(.is-collapsed) {
    transform: translateX(0);
    width: 280px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>

<style scoped>
/* ... (keep all your existing styles) */

/* Add these new animation styles */
.child-items-enter-active,
.child-items-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.child-items-enter-from,
.child-items-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.child-items-move {
  transition: transform 0.3s ease;
}

/* Hover animations */
.router-link-active,
button {
  transition: all 0.2s ease;
}

.router-link-active:hover,
button:hover {
  transform: translateX(2px);
}

.router-link-active:hover i,
button:hover i {
  transform: scale(1.1);
}

/* Active link animation */
.router-link-active {
  position: relative;
}

.router-link-active::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  transition: all 0.3s ease;
}

/* Dark mode specific animations */
:root.dark-mode .router-link-active:hover,
:root.dark-mode button:hover {
  transform: translateX(4px) scale(1.02);
}

/* Mobile specific animations */
@media (max-width: 767px) {
  .__drawer {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .__drawer:not(.is-collapsed) {
    transform: translateX(0);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>

