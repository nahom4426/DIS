<script setup>
import NewFormLayout from "@/components/NewFormLayout.vue";
import FormSubmitButton from "@/components/FormSubmitButton.vue";
import { useApiRequest } from "@/composables/useApiRequest";
import Input from "@/components/new_form_elements/Input.vue";
import { forgotPassword} from "../api/LoginApi";

import { sendResetCode } from "../api/LoginApi";
import { checkResetCode } from "../api/LoginApi";
import { toasted } from "@/utils/utils";
const forgotReq = useApiRequest();
const emit = defineEmits(["user", "previous"]);

function handleForgotPassword({ values }) {
  if (forgotReq.pending.value) return;
  forgotReq.send(
    () => forgotPassword({ email: values.email }),
    (res) => {
      handleSendResetCode({ values });
      toasted(res.success, "Confirmation code sent", res.error);
      if (res.success) {
        emit("user", values.email); // Pass the email to the next step
      }
    }
  );
}
function handleSendResetCode({ values }) {
  if (forgotReq.pending.value) return;
  forgotReq.send(
    () => sendResetCode(values.email),
    (res) => {
      checkResetCode({ verificationCode: values.verificationCode, email: props.email });
      toasted(res.success, "Confirmation code sent", res.error);
      if (res.success) {
        emit("user");
      }
    }
  );
}

function handleCheckResetCode({ values }) {
  if (forgotReq.pending.value) return;
  forgotReq.send(
    () => checkResetCode({ verificationCode: values.verificationCode, email: props.email }),
    (res) => {
    
      toasted(res.success, "Reset code verified", res.error);
      if (res.success) {
        emit("codeVerified");
      }
    }
  );
}


</script>
<template>
  <NewFormLayout v-slot="{ submit }" id="forgot-password-form">
    <div class="flex flex-col items-center justify-center gap-4">
      <h1 class="font-semibold text-xl">You forgot your password ?</h1>
      <h2 class="w-[360px] text-center">
        Please check your email inbox for a message from us. If you don't see
        it, be sure to check your spam or junk folder. Once you find the email,
        follow the instructions provided to retrieve your confirmation code.
      </h2>
    </div>
    <!-- <div @click="emit('previous')">Back</div> -->
    <div class="space-y-5 px-4">
      <div>
        <Input
          label="Email"
          name="email"
          validation="required|email"
          :attributes="{ placeholder: 'Enter your email' }"
        />
      </div>
      <div class="pt-4 border-t border-gray-200">
        <div class="flex justify-center">
          <FormSubmitButton
            class="bg-[#02676B] hover:bg-[green] text-white font-medium py-2 px-10 rounded-xl w-full"
            @click.prevent="submit(handleForgotPassword)"
            btn-text="Get Confirmation Code"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4 items-center">
        <!-- <h1 class="flex gap-2">
          Remember your password? -->
        <p
          class="text-base-clr cursor-pointer"
          @click.prevent="emit('previous')"
        >
          Login now
        </p>
        <!-- </h1> -->
        <h1 class="text-base-clr text-xs">©EDIS 2025</h1>
      </div>
    </div>
  </NewFormLayout>
</template>
