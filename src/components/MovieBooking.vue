<template>
  <div class="relative bg-white p-4 h-full rounded-lg shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-white-500 select-none overflow-hidden">
    <img :src="imageUrl" alt="Movie Poster" class="w-full h-64 object-cover rounded mb-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
    <h3 class="text-xl font-bold mb-2">{{ movie.title }}</h3>
    <div class="absolute top-0 left-0 p-4 h-full w-full bg-white opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between">
      <div>
        <p>Release Date: {{ movie.release_date }}</p>
        <p>Rating: {{ movie.vote_average }}/10</p>
      </div>
      <div class="mt-4">
        <label for="tickets" class="block text-sm font-bold mb-2">Tickets:</label>
        <input
          v-model.number="tickets"
          type="number"
          min="1"
          max="10"
          id="tickets"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <button
          @click="bookTickets"
          :disabled="bookingInProgress"
          class="w-full mt-2 bg-rose-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {{ bookingInProgress ? 'Booking...' : 'Book Tickets' }}
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