<template>
  <div class="min-h-screen select-none flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-red-600">
    <video
    class="fixed  w-auto min-w-full min-h-full max-w-none z-0 opacity-75"
    autoplay
    loop
    muted
  >
    <source :src="require('@/assets/avengers.mp4')" type="video/mp4" />
  </video>
    <div class="bg-rose-50 p-16 rounded-lg shadow-2xl w-2/3 transform transition-all duration-500 ease-in-out hover:scale-105">
      <h2 class="text-3xl text-center font-bold mb-10 text-gray-800 transition-all duration-500 ease-in-out transform translate-y-2 opacity-0 animate-fade-in-down">{{ formMode }}</h2>
      <form @submit.prevent="processForm" class="space-y-6">
        <input
          type="text"
          v-model="email"
          placeholder="Email"
          required
          class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-rose-500 transition-all duration-200 ease-in-out hover:border-rose-600"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-rose-500 transition-all duration-200 ease-in-out hover:border-rose-600"
        />
        <button
          type="submit"
          class="w-full px-4 py-2 rounded-lg font-medium bg-rose-600 text-white transition-all duration-200 ease-in-out hover:bg-rose-700 focus:outline-none transform hover:scale-105"
        >
          {{ formMode }}
        </button>
        <button
          type="button"
          @click="toggleFormMode"
          class="w-full px-4 py-2 mt-4 rounded-lg font-medium bg-rose-400 text-white transition-all duration-200 ease-in-out hover:bg-rose-600 focus:outline-none transform hover:scale-105"
        >
          Switch to {{ formMode === 'Login' ? 'Signup' : 'Login' }}
        </button>
        <button
          type="button"
          @click="sendPasswordResetEmail"
          class="w-full px-4 py-2 mt-4 rounded-lg font-medium bg-rose-400 text-white transition-all duration-200 ease-in-out hover:bg-rose-600 focus:outline-none transform hover:scale-105"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-down {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.5s ease-out 0.5s forwards;
}
</style>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail as resetPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useRouter } from 'vue-router';
import { user } from '../main'; // Import the user ref from main.js

export default {
  name: 'UserLogin',
  setup() {
    const email = ref('');
    const password = ref('');
    const formMode = ref('Login'); // This ref will keep track of the current form mode - Login or Signup
    const router = useRouter();

    const processForm = async () => {
      try {
        let loggedInUser;

        if (formMode.value === 'Login') {
          loggedInUser = await signInWithEmailAndPassword(auth, email.value, password.value);
        } else {
          loggedInUser = await createUserWithEmailAndPassword(auth, email.value, password.value);
        }

        user.value = loggedInUser.user; // Set the user ref to the logged-in user's information
        router.push('/'); // Redirect to the MovieExplorer page after successful login
      } catch (error) {
        console.log(error);
        alert('Failed to login or signup. Please check your credentials');
      }
    };

    const sendPasswordResetEmail = async () => {
  if (email.value === '') {
    alert('Please enter your email');
  } else {
    try {
      await resetPassword(auth, email.value);
      alert('Password reset email sent. Please check your email');
    } catch (error) {
      console.log(error);
      alert('Failed to send password reset email. Please check your email');
    }
  }
};

    const toggleFormMode = () => {
      formMode.value = formMode.value === 'Login' ? 'Signup' : 'Login';
    };

    return { email, password, processForm, formMode, toggleFormMode, sendPasswordResetEmail };
  }
};
</script>
