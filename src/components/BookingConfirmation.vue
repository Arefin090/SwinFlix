<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
    
    <!-- Success Card -->
    <div class="relative z-10 max-w-md w-full">
      <div class="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
        <!-- Success Icon -->
        <div class="relative mb-6">
          <div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <!-- Animated ring -->
          <div class="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-75"></div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-white mb-4">
          Success!
        </h1>
        
        <!-- Message -->
        <p class="text-gray-300 text-lg mb-2">
          Movie added to your list
        </p>
        <p class="text-gray-400 text-sm mb-8">
          You can access it anytime from your personal collection
        </p>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <router-link 
            to="/booking-history"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 block"
          >
            View My List
          </router-link>
          
          <router-link 
            to="/"
            class="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 block"
          >
            Browse More Movies
          </router-link>
        </div>

        <!-- Auto redirect info -->
        <div class="mt-6 text-center">
          <p class="text-gray-500 text-xs">
            Redirecting to home in {{ countdown }} seconds...
          </p>
        </div>
      </div>

      <!-- FinnFlix Logo -->
      <div class="text-center mt-6">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          FinnFlix
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'BookingConfirmation',
  setup() {
    const router = useRouter();
    const countdown = ref(5);
    let countdownInterval = null;

    onMounted(() => {
      // Start countdown
      countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          router.push('/');
        }
      }, 1000);
    });

    onUnmounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    });

    return {
      countdown
    };
  }
};
</script>