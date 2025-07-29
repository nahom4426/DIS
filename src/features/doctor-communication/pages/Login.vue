<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useApiRequest } from "@/composables/useApiRequest";
import { login } from "@/pages/api/LoginApi";
import { toasted } from "@/utils/utils";
import icons from "@/utils/icons";

const router = useRouter();
const auth = useAuthStore();
const loginReq = useApiRequest();
const isLoading = ref(false);
const activeTab = ref('login'); // 'login' or 'signup'

// Login form data
const loginForm = ref({
  email: '',
  password: ''
});

// Signup form data
const signupForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Doctor',
  specialization: '',
  license: '',
  hospital: ''
});

// Form validation
const errors = ref({});

function validateLoginForm() {
  errors.value = {};
  
  if (!loginForm.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)) {
    errors.value.email = 'Please enter a valid email';
  }
  
  if (!loginForm.value.password) {
    errors.value.password = 'Password is required';
  }
  
  return Object.keys(errors.value).length === 0;
}

function validateSignupForm() {
  errors.value = {};
  
  if (!signupForm.value.name) {
    errors.value.name = 'Name is required';
  }
  
  if (!signupForm.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.value.email)) {
    errors.value.email = 'Please enter a valid email';
  }
  
  if (!signupForm.value.password) {
    errors.value.password = 'Password is required';
  } else if (signupForm.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }
  
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
  }
  
  if (!signupForm.value.role) {
    errors.value.role = 'Role is required';
  }
  
  if (!signupForm.value.license) {
    errors.value.license = 'License number is required';
  }
  
  return Object.keys(errors.value).length === 0;
}

function handleLogin() {
  if (!validateLoginForm() || isLoading.value) return;
  
  isLoading.value = true;
  
  loginReq.send(
    () => login({ email: loginForm.value.email, password: loginForm.value.password }),
    (res) => {
      isLoading.value = false;
      
      if (res.success) {
        auth.setAuth({
          user: res.data,
          imageData: res.data?.imageData,
          accessToken: res.data?.token,
        });
        
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        router.push('/doctor-comm/dashboard');
        toasted(true, "Successfully Logged In", null);
      } else {
        toasted(false, "Login Failed", res.error);
      }
    }
  );
}

function handleSignup() {
  if (!validateSignupForm() || isLoading.value) return;
  
  isLoading.value = true;
  
  // Mock signup success for demo
  setTimeout(() => {
    isLoading.value = false;
    toasted(true, "Account created successfully! You can now log in.", null);
    activeTab.value = 'login';
    
    // Clear signup form
    signupForm.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Doctor',
      specialization: '',
      license: '',
      hospital: ''
    };
  }, 1500);
}

function switchTab(tab) {
  activeTab.value = tab;
  errors.value = {};
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img src="@/assets/logo.svg" alt="DIS Logo" class="mx-auto h-12 w-auto" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Doctor Communication System
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Connect with healthcare professionals securely
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 mb-6">
          <button
            @click="switchTab('login')"
            :class="[
              'py-2 px-4 text-sm font-medium focus:outline-none',
              activeTab === 'login'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Sign In
          </button>
          <button
            @click="switchTab('signup')"
            :class="[
              'py-2 px-4 text-sm font-medium focus:outline-none',
              activeTab === 'signup'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Create Account
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your email"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your password"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <span v-if="isLoading">Signing in...</span>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>

        <!-- Signup Form -->
        <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="signupForm.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your full name"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>
          </div>

          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your email"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="signup-password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input
                  id="signup-password"
                  v-model="signupForm.password"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Create password"
                />
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
              </div>
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div class="mt-1">
                <input
                  id="confirm-password"
                  v-model="signupForm.confirmPassword"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Confirm password"
                />
                <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div class="mt-1">
              <select
                id="role"
                v-model="signupForm.role"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="Doctor">Doctor</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Nurse">Nurse</option>
              </select>
              <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
            </div>
          </div>

          <div>
            <label for="specialization" class="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <div class="mt-1">
              <input
                id="specialization"
                v-model="signupForm.specialization"
                type="text"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="e.g., Cardiology, General Practice"
              />
            </div>
          </div>

          <div>
            <label for="license" class="block text-sm font-medium text-gray-700">
              License Number
            </label>
            <div class="mt-1">
              <input
                id="license"
                v-model="signupForm.license"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your professional license number"
              />
              <p v-if="errors.license" class="mt-1 text-sm text-red-600">{{ errors.license }}</p>
            </div>
          </div>

          <div>
            <label for="hospital" class="block text-sm font-medium text-gray-700">
              Hospital/Clinic
            </label>
            <div class="mt-1">
              <input
                id="hospital"
                v-model="signupForm.hospital"
                type="text"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your hospital or clinic name"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <span v-if="isLoading">Creating account...</span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a
                href="#"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Google</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              </a>
            </div>

            <div>
              <a
                href="#"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Microsoft</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>