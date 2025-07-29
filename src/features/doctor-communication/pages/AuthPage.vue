<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toasted } from "@/utils/utils";

const router = useRouter();
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
  
  // Mock login success for demo
  setTimeout(() => {
    isLoading.value = false;
    
    // Mock successful login
    const mockUser = {
      id: 1,
      name: 'Dr. John Smith',
      email: loginForm.value.email,
      role: 'Doctor',
      specialization: 'Cardiology',
      license: 'MD123456',
      hospital: 'General Hospital'
    };
    
    localStorage.setItem('doctorCommUser', JSON.stringify(mockUser));
    router.push('/doctor-comm/dashboard');
    toasted(true, "Successfully Logged In", null);
  }, 1500);
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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center items-center mb-6">
        <div class="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center font-bold text-lg">
          DC
        </div>
        <span class="text-blue-800 font-bold text-xl ml-3">Doctor Communication</span>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Healthcare Professional Portal
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Secure communication platform for medical professionals
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 mb-6">
          <button
            @click="switchTab('login')"
            :class="[
              'py-2 px-4 text-sm font-medium focus:outline-none transition-colors',
              activeTab === 'login'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Sign In
          </button>
          <button
            @click="switchTab('signup')"
            :class="[
              'py-2 px-4 text-sm font-medium focus:outline-none transition-colors',
              activeTab === 'signup'
                ? 'border-b-2 border-blue-500 text-blue-600'
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm password"
                />
                <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              Professional Role
            </label>
            <div class="mt-1">
              <select
                id="role"
                v-model="signupForm.role"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Doctor">Doctor</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Nurse">Nurse</option>
                <option value="Specialist">Specialist</option>
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Cardiology, General Practice, Pharmacy"
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your hospital or clinic name"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <span v-if="isLoading">Creating account...</span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
          <p class="text-xs text-gray-600">Email: doctor@example.com</p>
          <p class="text-xs text-gray-600">Password: password123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>


