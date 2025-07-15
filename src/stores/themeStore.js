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