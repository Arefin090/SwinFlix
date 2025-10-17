<template>
  <div class="group relative backdrop-blur-md bg-white/5 border border-white/10 p-4 h-full rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/20 select-none overflow-hidden movie-card">
    <div class="relative overflow-hidden rounded-xl mb-4">
      <img :src="imageUrl" alt="Movie Poster" class="w-full h-64 object-cover transition duration-700 ease-in-out transform group-hover:scale-110">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
        ⭐ {{ movie.vote_average?.toFixed(1) || 'N/A' }}
      </div>
    </div>
    <h3 class="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-2">{{ movie.title }}</h3>
    <p class="text-gray-400 text-sm mb-4">{{ movie.release_date?.substring(0, 4) || 'TBA' }}</p>
    <div class="absolute top-0 left-0 p-4 h-full w-full backdrop-blur-lg bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between rounded-2xl">
      <div class="space-y-3">
        <h4 class="text-white font-bold text-lg mb-3">{{ movie.title }}</h4>
        <div class="space-y-2 text-sm">
          <p class="text-gray-300"><span class="text-blue-400 font-semibold">Release:</span> {{ movie.release_date || 'TBA' }}</p>
          <p class="text-gray-300"><span class="text-yellow-400 font-semibold">Rating:</span> {{ movie.vote_average?.toFixed(1) || 'N/A' }}/10</p>
          <p class="text-gray-300 text-xs line-clamp-3">{{ movie.overview || 'No description available.' }}</p>
        </div>
      </div>
      <div class="space-y-4">
        <label for="tickets" class="block text-sm font-bold text-white mb-2">Number of Tickets:</label>
        <input
          v-model.number="tickets"
          type="number"
          min="1"
          max="10"
          id="tickets"
          class="w-full p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
        />
        <button
          @click="bookTickets"
          :disabled="bookingInProgress"
          class="w-full mt-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25 disabled:cursor-not-allowed"
        >
          <span v-if="bookingInProgress" class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Booking...</span>
          </span>
          <span v-else>🎬 Book Tickets</span>
        </button>
      </div>
    </div>
  </div>
</template>






<script>
import { db } from '@/firebase';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { user } from '../main';

export default {
  props: {
    movie: Object,
    imageUrl: String,
  },
  setup(props) {
    const tickets = ref(1);
    const bookingInProgress = ref(false);
    const router = useRouter();
    const loggedInUser = computed(() => user.value); 

    const bookTickets = async () => {
      if (!loggedInUser.value) {
        // Redirect to login page if the user is not logged in
        router.push({ name: 'UserLogin' });
        return;
      }

      bookingInProgress.value = true;

      try {
        const bookingsRef = db.collection("bookings");
        console.log("Adding booking to Firebase...");
        const response = await bookingsRef.add({
          movieId: props.movie.id,
          title: props.movie.title,
          userId: loggedInUser.value.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Booking response:", response);

        if (response) {
          alert("Tickets booked successfully!");
          router.push({ name: 'BookingConfirmation' });
        } else {
          throw new Error("No response received from Firebase.");
        }
      } catch (error) {
        console.error("Error booking tickets:", error);
        alert("Error booking tickets. Please try again.");
      } finally {
        bookingInProgress.value = false;
      }
    };

    return { tickets, bookingInProgress, bookTickets };
  }
};
</script>