<template>
  <transition name="fade">
    <div class="flex justify-center items-center h-screen select-none bg-confirm">
      
      <div class="relative p-6 bg-white rounded-lg shadow-lg text-center">
        <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></div>
        <svg class="w-16 h-16 text-rose-500 mx-auto text-center" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 class="mt-8 animate-bounce text-3xl font-bold">Congratulations!</h1>
        <p class="text-lg text-gray-600">You have successfully booked the tickets.</p>
        <p class="mt-4 text-gray-500">Enjoy your show with a loved one!</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'BookingConfirmation',
  mounted() {
    const router = useRouter();

    setTimeout(() => {
      router.push({ name: 'MovieExplorer' });
    }, 5000);
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


.bg-confirm {
  
  background-image: url('@/assets/confirm.jpg');
  background-size: cover;
  background-position: center;
}
</style>
