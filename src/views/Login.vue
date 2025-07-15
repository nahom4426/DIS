<script setup>
import Button from "@/components/Button.vue";
import Form from "@/components/new_form_builder/Form.vue";
import Input from "@/components/new_form_elements/Input.vue";
import InputPassword from "@/components/new_form_elements/InputPassword.vue";
import { useApiRequest } from "@/composables/useApiRequest";
import { login } from "@/features/auth/authApi";
import { useAuthStore } from "@/stores/auth";
import { toasted } from "@/utils/utils";
import { useRouter } from "vue-router";

const req = useApiRequest();
const auth = useAuthStore();
const router = useRouter();

function loginUser({ values }) {
  req.send(
    () => login(values),
    (res) => {
      if (res.success) {
        auth.setAuth(res.data);
        router.replace("/");
      }
      toasted(res.success, "Loggedin Successfully", res.error);
    }
  );
}
</script>
<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10 text-center px-8">
        <div class="mb-8">
          <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">
            DrugInfo<span class="font-light">System</span>
          </h1>
          <p class="text-xl text-white/90 mb-8">
            Comprehensive Drug Information Management
          </p>
        </div>
        
        <div class="space-y-4 text-white/80">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-2 h-2 bg-white/60 rounded-full"></div>
            <span>Drug Inventory Management</span>
          </div>
          <div class="flex items-center justify-center space-x-3">
            <div class="w-2 h-2 bg-white/60 rounded-full"></div>
            <span>Prescription Tracking</span>
          </div>
          <div class="flex items-center justify-center space-x-3">
            <div class="w-2 h-2 bg-white/60 rounded-full"></div>
            <span>Quality Control & Analytics</span>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full"></div>
      <div class="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full"></div>
      <div class="absolute top-1/2 right-20 w-16 h-16 bg-white/5 rounded-full"></div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex items-center justify-center p-8 bg-neutral-25">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-neutral-900 mb-2">Welcome Back</h2>
          <p class="text-neutral-600">Sign in to your DrugInfo System account</p>
        </div>

        <Form
          v-slot="{ submit }"
          id="login-form"
          class="space-y-6"
        >
          <Input
            :focus="true"
            validation="required|email"
            label="Email Address"
            name="email"
            :attributes="{
              placeholder: 'Enter your email',
              class: 'w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            }"
          />
          
          <InputPassword
            validation="required"
            label="Password"
            name="password"
            :attributes="{
              placeholder: 'Enter your password',
              class: 'w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            }"
          />

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500">
              <span class="ml-2 text-sm text-neutral-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-primary-600 hover:text-primary-500">
              Forgot password?
            </a>
          </div>

          <Button
            :pending="req.pending.value"
            @click.prevent="submit(loginUser)"
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Sign In
          </Button>
        </Form>

        <div class="mt-8 text-center">
          <p class="text-sm text-neutral-600">
            Need help? 
            <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

