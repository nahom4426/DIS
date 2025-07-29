import icons from "@/utils/icons";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useThemeStore = defineStore("themeStore", () => {
  const themes = [
    { id: "default", name: "Pharmaceutical Blue", class: "", description: "Clean and professional" },
    { id: "medical", name: "Medical Green", class: "theme-medical", description: "Healthcare focused" },
    { id: "pharmacy", name: "Pharmacy Amber", class: "theme-pharmacy", description: "Warm and trustworthy" },
    { id: "clinical", name: "Clinical Purple", class: "theme-clinical", description: "Research oriented" },
    { id: "research", name: "Research Pink", class: "theme-research", description: "Innovation focused" },
    { id: "dark", name: "Dark Mode", class: "theme-dark", description: "Easy on the eyes" },
  ];

  const activeTheme = ref(
    localStorage.getItem("drug-system-theme") || "default"
  );

  const currentTheme = computed(() => {
    const theme = themes.find(t => t.id === activeTheme.value);
    return theme?.class || "";
  });

  const currentThemeInfo = computed(() => {
    return themes.find(t => t.id === activeTheme.value) || themes[0];
  });

  function setTheme(themeId) {
    activeTheme.value = themeId;
    localStorage.setItem("drug-system-theme", themeId);
    
    // Apply theme class to document root
    document.documentElement.className = currentTheme.value;
  }

  function getAvailableThemes() {
    return themes;
  }

  // Initialize theme on store creation
  document.documentElement.className = currentTheme.value;

  return {
    activeTheme,
    currentTheme,
    currentThemeInfo,
    themes,
    setTheme,
    getAvailableThemes,
  };
});

// Drug Information System Navigation
export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: icons.dashboard,
  },
  {
    path: "/doctor-comm/dashboard",
    name: "Doctor Communication",
    icon: icons.communication, // Add appropriate icon
  },
  {
    name: "Drug Management",
    icon: icons.drugs,
    privilege: [""],
    navs: [
      {
        path: "/drug_inventory",
        name: "Drug Inventory",
        icon: icons.inventory,
        privilege: [""],
      },
      {
        path: "/add_drug",
        name: "Add New Drug",
        icon: icons.addDrug,
        privilege: [""],
      },
      {
        path: "/drug_categories",
        name: "Categories",
        icon: icons.categories,
        privilege: [""],
      },
      {
        path: "/expired_drugs",
        name: "Expired Drugs",
        icon: icons.expired,
        privilege: [""],
      },
    ],
  },
  {
    name: "Pharmacy Operations",
    icon: icons.pharmacy,
    privilege: [""],
    navs: [
      {
        path: "/prescriptions",
        name: "Prescriptions",
        icon: icons.prescription,
        privilege: [""],
      },
      {
        path: "/dispensing",
        name: "Drug Dispensing",
        icon: icons.dispensing,
        privilege: [""],
      },
      {
        path: "/stock_management",
        name: "Stock Management",
        icon: icons.stock,
        privilege: [""],
      },
      {
        path: "/drug_interactions",
        name: "Drug Interactions",
        icon: icons.interactions,
        privilege: [""],
      },
    ],
  },
  {
    name: "Suppliers & Procurement",
    icon: icons.suppliers,
    privilege: [""],
    navs: [
      {
        path: "/suppliers",
        name: "Supplier List",
        icon: icons.supplierList,
        privilege: [""],
      },
      {
        path: "/purchase_orders",
        name: "Purchase Orders",
        icon: icons.purchaseOrder,
        privilege: [""],
      },
      {
        path: "/deliveries",
        name: "Deliveries",
        icon: icons.delivery,
        privilege: [""],
      },
      {
        path: "/supplier_contracts",
        name: "Contracts",
        icon: icons.contracts,
        privilege: [""],
      },
    ],
  },
  {
    path: "/drug_database",
    name: "Drug Database",
    icon: icons.database,
    privilege: [""],
  },
  {
    name: "Reports & Analytics",
    icon: icons.reports,
    privilege: ["VIEW_REPORTS"],
    navs: [
      {
        path: "/sales_reports",
        name: "Sales Reports",
        icon: icons.salesReport,
        privilege: ["VIEW_SALES"],
      },
      {
        path: "/inventory_reports",
        name: "Inventory Reports",
        icon: icons.inventoryReport,
        privilege: ["VIEW_INVENTORY"],
      },
      {
        path: "/expiry_alerts",
        name: "Expiry Alerts",
        icon: icons.alerts,
        privilege: ["VIEW_ALERTS"],
      },
      {
        path: "/usage_analytics",
        name: "Usage Analytics",
        icon: icons.analytics,
        privilege: ["VIEW_ANALYTICS"],
      },
    ],
  },
  {
    name: "Quality Control",
    icon: icons.quality,
    privilege: ["QUALITY_CONTROL"],
    navs: [
      {
        path: "/batch_tracking",
        name: "Batch Tracking",
        icon: icons.batch,
        privilege: ["TRACK_BATCHES"],
      },
      {
        path: "/quality_tests",
        name: "Quality Tests",
        icon: icons.tests,
        privilege: ["MANAGE_TESTS"],
      },
      {
        path: "/recalls",
        name: "Drug Recalls",
        icon: icons.recall,
        privilege: ["MANAGE_RECALLS"],
      },
    ],
  },
  {
    path: "/users",
    name: "User Management",
    icon: icons.user,
    // privilege: ["MANAGE_USERS"],
  },
  {
    path: "/roles",
    name: "Roles & Permissions",
    icon: icons.role,
    // privilege: ["MANAGE_ROLES"],
  },
    {
    path: "/privileges",
    name: "Privilege",
    icon: icons.privilege,
    // privilege: ["CREATE_USER"],
  },
  {
    name: "Doctor Communication",
    icon: icons.chat,
    privilege: [""],
    navs: [
      {
        path: "/doctor-comm/inquiries",
        name: "Recent Inquiries",
        icon: icons.inbox,
        privilege: [""],
      },
      {
        path: "/doctor-comm/history",
        name: "Full History",
        icon: icons.history,
        privilege: [""],
      },
      {
        path: "/doctor-comm/drug-lookup",
        name: "Drug Lookup Tool",
        icon: icons.search,
        privilege: [""],
      },
    ],
  },
  // {
  //   path: "/system_settings",
  //   name: "System Settings",
  //   icon: icons.settings,
  //   // privilege: ["SYSTEM_ADMIN"],
  // },
  // {
  //   path: "/theme_settings",
  //   name: "Apperance",
  //   icon: icons.palette,
  // },
];





