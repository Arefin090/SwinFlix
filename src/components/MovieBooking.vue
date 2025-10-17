<template>
  <div 
    class="group relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
    @click="showMovieDetails"
  >
    <!-- Movie Poster -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <img 
        :src="imageUrl" 
        :alt="movie.title"
        class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        loading="lazy"
      >
      
      <!-- Gradient Overlay on Hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Rating Badge -->
      <div class="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
        ⭐ {{ movie.vote_average?.toFixed(1) || 'N/A' }}
      </div>

      <!-- Hover Play Button -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button class="bg-white/20 backdrop-blur-sm border-2 border-white rounded-full p-4 hover:bg-white/30 transition-all duration-200">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Movie Info -->
    <div class="p-3">
      <h3 class="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-gray-300 transition-colors">
        {{ movie.title }}
      </h3>
      <p class="text-gray-400 text-xs">
        {{ movie.release_date?.substring(0, 4) || 'TBA' }}
      </p>
    </div>

    <!-- Hover Details Overlay -->
    <div class="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-95 transition-all duration-300 flex flex-col justify-between p-4">
      <div>
        <h4 class="text-white font-bold text-lg mb-3 line-clamp-2">{{ movie.title }}</h4>
        <div class="space-y-2 mb-4">
          <div class="flex items-center space-x-4 text-sm">
            <span class="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              ⭐ {{ movie.vote_average?.toFixed(1) }}
            </span>
            <span class="text-gray-300">{{ movie.release_date?.substring(0, 4) }}</span>
            <span class="border border-gray-400 text-gray-400 px-2 py-1 rounded text-xs">HD</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed line-clamp-4">
            {{ movie.overview || 'No description available.' }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button 
          @click.stop="playTrailer"
          class="w-full bg-white text-black font-semibold py-3 px-4 rounded flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Play</span>
        </button>
        
        <button 
          @click.stop="quickBook"
          :disabled="bookingInProgress"
          :class="[
            'w-full font-semibold py-3 px-4 rounded transition-all duration-200 disabled:cursor-not-allowed',
            bookingSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700'
          ]"
        >
          <span v-if="bookingInProgress" class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Adding...</span>
          </span>
          <span v-else-if="bookingSuccess" class="text-white">✓ Added!</span>
          <span v-else class="text-white">+ My List</span>
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
import axios from 'axios';

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
    const loggedInUser = computed(() => user.value);

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
        const bookingsRef = db.collection("bookings");
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
        console.error("Error booking tickets:", error);
        alert("Error adding to list. Please try again.");
      } finally {
        bookingInProgress.value = false;
      }
    };

    return { 
      bookingInProgress, 
      bookingSuccess,
      showMovieDetails, 
      playTrailer, 
      quickBook 
    };
  }
};
</script>