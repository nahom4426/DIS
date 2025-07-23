<script setup>
import { useAuthStore } from "@/stores/auth";
import icons from "@/utils/icons";
import { convertBase64Image } from "@/utils/utils";
import { ref } from "vue";
import companyLogo from '@/assets/img/companyLogo.jpeg'

const authStore = useAuthStore();

const profilePicture = ref(authStore.auth?.user?.logo);


async function processProfilePicture() {
  if (profilePicture.value && !profilePicture.value.startsWith("data:image/")) {
    profilePicture.value = `data:image/png;base64,${profilePicture.value}`;
    return
  }

 
}

processProfilePicture();
</script>
