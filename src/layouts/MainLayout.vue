<script setup>
import Drawer from "@/components/Drawer.vue";
import Dropdown from "@/components/Dropdown.vue";
import { useAuthStore } from "@/stores/auth";
import { useBreadcrumb } from "@/stores/breadCrumbsStore";
import { useColorStore } from "@/stores/colorStore";
import icons from "@/utils/icons";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import navs from "@/config/navs"; // Make sure you import this
import NavBar from "@/components/NavBar.vue";

const authStore = useAuthStore();
const isCollapsed = ref(false);
const route = useRoute();
const breadcrumbs = useBreadcrumb();
const colorStore = useColorStore();
const expandedMenus = ref([]);

function toggleMenu(name) {
  if (expandedMenus.value.includes(name)) {
    expandedMenus.value = expandedMenus.value.filter((n) => n !== name);
  } else {
    expandedMenus.value.push(name);
  }
}

function toggleSidebar(status) {
  if (!status) {
    document.documentElement.style.setProperty("--drawer-width", "50px");
  } else {
    document.documentElement.style.setProperty("--drawer-width", "16rem");
  }
  isCollapsed.value = !isCollapsed.value;
}

const doctorCommNavs = [
  {
    name: 'Dashboard',
    path: '/doctor-comm/dashboard',
    icon: icons.dashboard,
    privilege: ['Doctor Communication']
  },
  {
    name: 'Recent Inquiries',
    path: '/doctor-comm/inquiries',
    icon: icons.inbox,
    privilege: ['Doctor Communication']
  },
  {
    name: 'Full History',
    path: '/doctor-comm/history',
    icon: icons.history,
    privilege: ['Doctor Communication']
  },
  {
    name: 'Drug Lookup',
    path: '/doctor-comm/drug-lookup',
    icon: icons.search,
    privilege: ['Doctor Communication']
  }
]

// Add doctor comm navs to your existing navigation
const allNavs = [
  ...navs,
  ...doctorCommNavs
]

const filteredNavs = computed(() => {
  return allNavs.filter((nav) => {
    if (nav.privilege && nav.privilege.length > 0) {
      return nav.privilege.some((privilege) =>
        authStore.auth?.user?.authorities?.includes(privilege) ||
        authStore.auth?.user?.authorities?.includes("All Privileges")
      );
    }
    return true;
  });
});

onMounted(() => {
  filteredNavs.value.forEach((item) => {
    if (item.navs?.some((child) => child.path === route.path)) {
      expandedMenus.value.push(item.name);
    }
  });
});
</script>

<template>
  <div
    :class="colorStore.color"
    class="flex h-screen py-3 pl-3 gap-6 w-full bg-[#F6F7FA] overflow-hidden"
  >
    <div class="h-full w-navbar-width rounded-lg transition-all duration-300 flex-shrink-0">
      <Drawer
        :is-collapsed="isCollapsed"
        :toggle-sidebar="toggleSidebar"
        :navs="filteredNavs"
        :expanded-menus="expandedMenus"
        :toggle-menu="toggleMenu"
      />
    </div>

    <div class="flex flex-col gap-6 flex-1 pr-6 min-h-0">
      <NavBar :breadcrumbs="breadcrumbs" class="flex-shrink-0" />

      <div class="flex-1 overflow-y-auto min-h-0">
        <div class="pb-6">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>







