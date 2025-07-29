<template>
  <div class="h-screen w-screen font-sans overflow-hidden bg-purple-100">
    <div class="flex flex-col md:flex-row w-full h-full gap-x-8">

      <!-- Left Side Image -->
      <div class="md:w-1/2 hidden md:block h-full">
        <img 
          src="./capsule.jpg"
          alt="Doctor and Pharmacist"
          class="object-contain w-full h-full mx-auto my-auto"
          @error="handleImageError"
        />
      </div>

      <!-- Right Side Signup Form (scrollable card) -->
      <div class="md:w-1/2 w-full flex items-center justify-center bg-[#E6F2F2] h-full">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-6 flex flex-col justify-start overflow-y-auto"
             style="max-height: 90vh;">

          <!-- Header -->
          <div class="mb-6 text-center">
            <div class="flex justify-center mb-6 items-center">
  <div class="rounded-full bg-purple-700 text-white w-12 h-12 flex items-center justify-center font-extrabold text-lg relative shrink-0">
    EDIS
  </div>
  <span class="text-purple-800 font-semibold text-lg ml-2 select-none">Drug Consultation</span>
</div>

            <h2 class="text-gray-800 text-lg font-semibold mb-1">Create your account</h2>
            <p class="text-gray-600 text-xs">Sign up to access the HealthConnect dashboard.</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSignup" class="space-y-4 text-sm" novalidate>
            <!-- Full Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name <span class="text-red-600">*</span></label>
              <input
                type="text"
                id="name"
                v-model="name"
                required
                placeholder="Enter your full name"
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            <!-- Location -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location <span class="text-red-600">*</span></label>
              <input
                type="text"
                id="location"
                v-model="location"
                required
                placeholder="Enter your location"
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-600">*</span></label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Enter your email"
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password <span class="text-red-600">*</span></label>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Create a password"
                  class="w-full border border-gray-200 py-2 px-3 pr-10 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                />
                <button type="button" @click="togglePassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.223-3.425m3.975-2.777A3 3 0 0112 9a3 3 0 013 3m2.452 1.855l3.32 3.32m-.451-5.74a9.97 9.97 0 00-4.576-4.576m-4.95 1.05l-3.32-3.32" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span class="text-red-600">*</span></label>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                placeholder="Re-enter your password"
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            <!-- Role -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role <span class="text-red-600">*</span></label>
              <select
                id="role"
                v-model="role"
                required
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              >
                <option value="" disabled>Select your role</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </div>

            <!-- Hospital -->
            <div>
              <label for="hospital" class="block text-sm font-medium text-gray-700 mb-1">Hospital <span class="text-red-600">*</span></label>
              <select
                id="hospital"
                v-model="hospital"
                required
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              >
                <option value="" disabled>Select your hospital</option>
                <option value="tikur-anbessa">Tikur Anbessa Specialized Hospital</option>
                <option value="black-lion">Black Lion Hospital</option>
                <option value="st-paul">St. Paul's Hospital</option>
                <option value="yekatit-12">Yekatit 12 Hospital</option>
                <option value="gandhi-memorial">Gandhi Memorial Hospital</option>
                <option value="alert-hospital">ALERT Hospital</option>
                <option value="bethzatha">Bethzatha General Hospital</option>
                <option value="hayat">Hayat Medical College Hospital</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- License Number -->
            <div>
              <label for="license" class="block text-sm font-medium text-gray-700 mb-1">License Number <span class="text-red-600">*</span></label>
              <input
                type="text"
                id="license"
                v-model="license"
                required
                placeholder="Enter your professional license number"
                class="w-full border border-gray-200 py-2 px-3 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>

            <!-- Submit -->
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full bg-purple-800 text-white py-3 rounded-lg font-semibold hover:bg-purple-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50">
              {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
            </button>
          </form>

          <!-- Footer -->
          <p class="text-center text-xs text-gray-500 mt-4">
            Already have an account?
            <router-link to="/login" class="text-purple-500 font-semibold hover:text-teal-700">Login</router-link>
          </p>
          <p class="mt-2 text-center text-gray-400 text-xs select-none">©HealthConnect 2025</p>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const location = ref('')
const role = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSignup = () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value || !location.value || !role.value || !hospital.value || !license.value) {
    alert('Please fill in all fields.')
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    alert('Please enter a valid email.')
    return
  }

  if (password.value.length < 6) {
    alert('Password must be at least 6 characters.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  alert(`Account created for ${name.value} as ${role.value} at ${hospital.value}. Redirecting...`)
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  location.value = ''
  role.value = ''
  hospital.value = ''
  license.value = ''
}

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x800?text=Image+not+available'
}
</script>
