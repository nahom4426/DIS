<script setup>
//import NewFormLayout from "@/components/NewFormLayout.vue";
import NewFormLayout from "@/components/NewFormLayout.vue";
import InputEmail from "@/components/new_form_elements/InputEmail.vue";
import InputPassword from "@/components/new_form_elements/InputPassword.vue";
import FormSubmitButton from "@/components/FormSubmitButton.vue";
import Input from "@/components/new_form_elements/Input.vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useApiRequest } from "@/composables/useApiRequest";
import { login } from "../api/LoginApi";
import { toasted } from "@/utils/utils";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const route = useRoute();
const redirecting = ref(true);
const auth = useAuthStore();
let detiail = localStorage.getItem("userDetail");
// function reRoute() {
//   if (route.query.redirect && route.query?.from == "other")
//     location.href = route.query.redirect;
//   else if (route.query.redirect) router.replace(route.query.redirect);
//   else router.replace("/");
// }

// if (detiail) {
//   detiail = JSON.parse(detiail);
//   auth.setAuth({
//     user: detiail,
//     accessToken: detiail.token,
//   });
//   reRoute();
// } else {
//   redirecting.value = false;
// }

redirecting.value = false;

const loginReq = useApiRequest();
function handleLogin({ values }) {
  if (loginReq.pending.value) return;
  
  // Temporary bypass - skip actual API call
  // const mockResponse = {
  //   success: true,
  //   data: {
  //     userUuid: 'temp-user-123',
  //     email: values.email,
  //     firstName: 'Test',
  //     lastName: 'User',
  //     roleName: 'Pharmacist',
  //     authorities: ['All Privileges'],
  //     token: 'temp-token-123',
  //     firstTimeLogin: false
  //   }
  // };

  // // Simulate the successful login flow
  // auth.setAuth({
  //   user: mockResponse.data,
  //   imageData: mockResponse.data?.imageData,
  //   accessToken: mockResponse.data?.token,
  // });

  // localStorage.setItem("userDetail", JSON.stringify(mockResponse.data));
  // reRoute();
  // toasted(true, "Successfully Logged In (Temporary Mode)", null);
  
  // Original code (commented out for temporary bypass)
  
  loginReq.send(
    () => login(values),
    (res) => {
      if (res.success) {
        auth.setAuth({
          user: res.data,
          imageData:res.data?.imageData,
          accessToken: res.data?.token,
        });
        if(!auth.auth?.user?.firstTimeLogin){
          openModal('ChangePassword')
        }
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        // reRoute(); // Comment this out
      }
      toasted(res.success, "Successfully Logged In", res.error);
    }
  );
  
}
const emit = defineEmits(["user"]);
</script>
<template>
  <NewFormLayout v-slot="{ submit }" id="login-form">
    <div class="space-y-6">
      <div class="flex flex-col items-center justify-center gap-4">
        <h2 class="w-[332px] text-center">
          Upon successful authentication, access your role-specific dashboard
          within the platform.
        </h2>
      </div>
      <Input
        label="Email"
        name="username"
        validation="required|email"
        :attributes="{ placeholder: 'Enter your email' }"
      />

      <InputPassword
        label="Password"
        name="password"
        validation="required"
        :attributes="{ placeholder: 'Enter your password' }"
      />
      <div class="text-right text-sm">
        <a href="#" @click.prevent="emit('user')" class="hover:underline">
          Forgot password?
        </a>
      </div>
      <div class="">
        <div class="flex justify-center">
          <FormSubmitButton
            @click.prevent="submit(handleLogin)"
            btn-text="Login"
          />
        </div>
      </div>
    </div>
  </NewFormLayout>
</template>


