<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4 py-8">
    <!-- Background with subtle gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
    
    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-6 md:mb-8">
        <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
          FinnFlix
        </h1>
        <p class="text-gray-400 text-sm">Your personal movie experience</p>
      </div>

      <!-- Form Container -->
      <div class="bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 class="text-xl md:text-2xl font-bold text-white text-center mb-6 md:mb-8">
          {{ formMode === 'Login' ? 'Sign In' : 'Create Account' }}
        </h2>

        <form @submit.prevent="processForm" class="space-y-5 md:space-y-6">
          <!-- Email Input -->
          <div class="space-y-2">
            <label class="text-gray-300 text-sm font-medium">Email</label>
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
              class="w-full p-3 md:p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-sm md:text-base"
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label class="text-gray-300 text-sm font-medium">Password</label>
            <input
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
              class="w-full p-3 md:p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-sm md:text-base"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold py-3 px-6 md:py-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
          >
            <span v-if="isLoading" class="flex items-center justify-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>{{ formMode === 'Login' ? 'Signing In...' : 'Creating Account...' }}</span>
            </span>
            <span v-else>
              {{ formMode === 'Login' ? 'Sign In' : 'Create Account' }}
            </span>
          </button>

          <!-- Forgot Password -->
          <button
            v-if="formMode === 'Login'"
            type="button"
            @click="sendPasswordResetEmail"
            class="w-full text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            Forgot your password?
          </button>
        </form>

        <!-- Toggle Form Mode -->
        <div class="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-700 text-center">
          <p class="text-gray-400 text-sm mb-3 md:mb-4">
            {{ formMode === 'Login' ? "Don't have an account?" : "Already have an account?" }}
          </p>
          <button
            type="button"
            @click="toggleFormMode"
            class="text-red-500 hover:text-red-400 font-medium transition-colors duration-200 text-sm md:text-base"
          >
            {{ formMode === 'Login' ? 'Sign up now' : 'Sign in instead' }}
          </button>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-4 md:mt-6">
        <router-link 
          to="/" 
          class="text-gray-400 hover:text-white text-sm transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to FinnFlix</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { sendPasswordResetEmail as resetPassword } from "firebase/auth";
import { auth } from '../firebase';

export default {
  name: 'UserLogin',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toastStore = useToastStore();

    const email = ref('');
    const password = ref('');
    const formMode = ref('Login');

    const processForm = async () => {
      authStore.clearError();
      
      try {
        if (formMode.value === 'Login') {
          await authStore.signIn(email.value, password.value);
          toastStore.success('Welcome back!');
        } else {
          await authStore.signUp(email.value, password.value);
          toastStore.success('Account created successfully!');
        }
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (err) {
        toastStore.error(err.message);
      }
    };

    const sendPasswordResetEmail = async () => {
      if (email.value === '') {
        toastStore.error('Please enter your email address first.');
        return;
      }
      
      try {
        await resetPassword(auth, email.value);
        toastStore.success('Password reset email sent! Check your inbox.');
      } catch (error) {
        console.error('Password reset error:', error);
        toastStore.error('Failed to send reset email. Please check your email address.');
      }
    };

    const toggleFormMode = () => {
      formMode.value = formMode.value === 'Login' ? 'Signup' : 'Login';
      authStore.clearError();
    };

    return { 
      email, 
      password, 
      processForm, 
      formMode, 
      toggleFormMode, 
      sendPasswordResetEmail,
      isLoading: authStore.loading,
      error: authStore.error
    };
  }
};
</script>