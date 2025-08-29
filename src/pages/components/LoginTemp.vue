<script setup>
import { ref, reactive } from "vue";
import AuthLogin from "./AuthLogin.vue";
import Confirmation from "./Confirmation.vue";
import ForgetPassword from "./ForgetPassword.vue";
import NewPasswordConfirm from "./NewPasswordConfirm.vue";
import Congratulation from "./Congratulation.vue";

const activeForm = ref(0);

const form = [
  
  {
    name: "authLogin",
    component: AuthLogin,
  },
  {
    name: "forgotPassword",
    component: ForgetPassword,
  },

  {
    name: "confirmation",
    component: Confirmation,
  },

  {
    name: "newPasswordConfirm",
    component: NewPasswordConfirm,
  },
  {
    name: "congratulation",
    component: Congratulation,
  },
];
const email=ref('')
const values = ref(new Array(form.length));
const confirmationCode = ref("");
const next = (value) => {
 email.value=value
  
  if (activeForm.value == 2) {
    confirmationCode.value = value;
  }

  if (activeForm.value + 1 != form.length) activeForm.value++;
  else {
    activeForm.value = 0;
  }
};
function prevous() {
  if (activeForm.value > 0) activeForm.value = 0;
}

const profileData = reactive({
  email: '',
  title: '',
  firstName: '',
  userName: '',
  fatherName: '',
  grandFatherName: '', // <-- Add this
  roleName: '',        // <-- Add this
  gender: '',
  mobilePhone: '',
  userStatus: '',
  userType: '',
  providerUuid: '',
  roleUuid: '',
  imageData: null
});

function loadFromAuthStore() {
  const user = authStore.auth?.user || JSON.parse(localStorage.getItem('userDetail') || '{}');
  if (user) {
    Object.assign(profileData, {
      email: user.email || '',
      title: user.title || '',
      firstName: user.firstName || '',
      userName: user.userName || '',
      fatherName: user.fatherName || '',
      grandFatherName: user.grandFatherName || '', // <-- Add this
      roleName: user.roleName || '',               // <-- Add this
      gender: user.gender || 'Male',
      mobilePhone: user.mobilePhone || '',
      userStatus: user.userStatus || '',
      userType: user.userType || '',
      providerUuid: user.providerUuid || '',
      roleUuid: user.roleUuid || '',
      imageData: user.imageData || null
    });
  }
}
</script>
<template>
  <div
    class="flex flex-col rounded-2xl max-h-[32rem] scrollbar-hide bg-white p-9"
  >
    <div class="flex flex-col items-center justify-center mb-6 border-b border-base-clr3 pb-6">
      <img style="width: 100px; height: 80px;" src="../../assets/edislogo.png" alt="DIS Logo" />
      <div class="text-center mt-2">
        <h1 class="text-lg font-bold text-purple-500">Ethiopian Drug Information System</h1>
      </div>
    </div>

    <component
      v-bind="{ [form[activeForm].name]: values[activeForm] }"
      @user="next"
      @previous="prevous"
      :values="values"
      :email="email"
      :activeForm="activeForm"
      :is="form[activeForm].component"
      :confirmationCode="confirmationCode"
    >
    </component>
    <!--<div>
      {{ profileData.title }} {{ profileData.firstName || 'User' }} {{ profileData.fatherName || 'Name' }} {{ profileData.grandFatherName || '' }}
    </div>-->
    <p class="text-base text-gray-600 mb-1">{{ profileData.roleName || '' }}</p>
  </div>
</template>
