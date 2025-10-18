<template>
  <div
    class="bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    @click="showMovieDetails"
  >
    <!-- Movie Poster -->
    <div class="relative aspect-[2/3] overflow-hidden cursor-pointer">
      <img
        :src="imageUrl"
        :alt="movie.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <!-- Rating Badge -->
      <div
        class="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold"
      >
        ⭐ {{ movie.vote_average?.toFixed(1) || 'N/A' }}
      </div>
    </div>

    <!-- Movie Info -->
    <div class="p-3">
      <h3 class="text-white font-semibold text-sm mb-2 line-clamp-2">
        {{ movie.title }}
      </h3>
      <p class="text-gray-400 text-xs mb-3">
        {{ movie.release_date?.substring(0, 4) || 'TBA' }}
      </p>

      <!-- Action Buttons (Always Visible) -->
      <div class="flex space-x-2">
        <button
          @click.stop="playTrailer"
          class="flex-1 bg-white text-black font-semibold py-2 px-3 rounded-md flex items-center justify-center space-x-1 hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Play</span>
        </button>

        <button
          @click.stop="quickBook"
          :disabled="bookingInProgress"
          :class="[
            'flex-1 font-semibold py-2 px-3 rounded-md transition-colors text-xs disabled:cursor-not-allowed',
            bookingSuccess
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800',
          ]"
        >
          <span
            v-if="bookingInProgress"
            class="flex items-center justify-center space-x-1"
          >
            <div
              class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"
            ></div>
            <span>Adding</span>
          </span>
          <span v-else-if="bookingSuccess">✓ Added</span>
          <span v-else>+ My List</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  props: {
    movie: Object,
    imageUrl: String,
  },
  emits: ['show-details', 'play-trailer'],
  setup(props, { emit }) {
    const bookingInProgress = ref(false);
    const bookingSuccess = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();
    const loggedInUser = computed(() => authStore.user);

    const showMovieDetails = () => {
      emit('show-details', props.movie);
    };

    const playTrailer = async () => {
      emit('play-trailer', props.movie);
    };

    const quickBook = async () => {
      if (!loggedInUser.value) {
        router.push({ name: 'UserLogin' });
        return;
      }

      bookingInProgress.value = true;
      bookingSuccess.value = false;

      try {
        const bookingsRef = db.collection('bookings');
        await bookingsRef.add({
          movieId: props.movie.id,
          title: props.movie.title,
          userId: loggedInUser.value.uid,
          tickets: 1,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // Show success state
        bookingSuccess.value = true;

        // Reset success state after 2 seconds
        setTimeout(() => {
          bookingSuccess.value = false;
        }, 2000);
      } catch (error) {
        console.error('Error booking tickets:', error);
        alert('Error adding to list. Please try again.');
      } finally {
        bookingInProgress.value = false;
      }
    };

    return {
      bookingInProgress,
      bookingSuccess,
      showMovieDetails,
      playTrailer,
      quickBook,
    };
  },
};
</script>
