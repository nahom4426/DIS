import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("authStore", () => {
  const auth = ref({
    user: {
      firstName: "Test",
      lastName: "User", 
      email: "test@example.com",
      roleName: "Admin",
      authorities: ["All Privileges"]
    },
    accessToken: "mock-token"
  });
  const imageData = ref('')

  function setAuth(val: any) {
    auth.value = val;
  }
  function setProfile(val: any) {
    imageData.value = val;
  }

  return { auth, setAuth, setProfile, imageData };
});
