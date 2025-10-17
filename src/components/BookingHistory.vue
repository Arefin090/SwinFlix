<template>
  <div class="min-h-screen bg-black">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
    
    <div class="relative z-10">
      <!-- Header -->
      <div class="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div class="container mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 md:space-x-4">
              <router-link 
                to="/" 
                class="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </router-link>
              <h1 class="text-2xl md:text-3xl font-bold text-white">My List</h1>
            </div>
            
            <div class="text-gray-400 text-xs md:text-sm">
              {{ bookings.length }} {{ bookings.length === 1 ? 'movie' : 'movies' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-2 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p class="text-gray-400">Loading your movies...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="bookings.length === 0" class="text-center py-12 md:py-20">
          <div class="max-w-md mx-auto px-4">
            <svg class="w-16 h-16 md:w-20 md:h-20 text-gray-600 mx-auto mb-4 md:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h2 class="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Your list is empty</h2>
            <p class="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">Movies and shows you add to your list will appear here.</p>
            <router-link 
              to="/" 
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
            >
              Browse Movies
            </router-link>
          </div>
        </div>

        <!-- Booking Grid -->
        <div v-else>
          <div class="grid grid-cols-1 gap-4 mb-8">
            <div 
              v-for="booking in paginatedBookings" 
              :key="booking.id"
              class="bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/80 transition-all duration-300 group"
            >
              <div class="flex items-center p-4 sm:p-6">
                <!-- Movie Poster Placeholder -->
                <div class="w-12 h-18 sm:w-16 sm:h-24 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 sm:mr-6">
                  <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0v16a1 1 0 001 1h8a1 1 0 001-1V4M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h2M7 4h10"></path>
                  </svg>
                </div>

                <!-- Movie Details -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {{ booking.title }}
                  </h3>
                  <div class="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                    <span class="flex items-center space-x-1 sm:space-x-2">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Added {{ formatDate(booking.timestamp) }}</span>
                    </span>
                    <span class="flex items-center space-x-1 sm:space-x-2">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                      </svg>
                      <span>{{ booking.tickets || 1 }} {{ (booking.tickets || 1) === 1 ? 'ticket' : 'tickets' }}</span>
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    @click="watchMovie(booking)"
                    class="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
                  >
                    <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>Play</span>
                  </button>
                  
                  <button 
                    @click="removeFromList(booking)"
                    class="text-gray-400 hover:text-red-400 p-2 sm:p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 touch-manipulation"
                    title="Remove from list"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center items-center space-x-3 md:space-x-4">
            <button 
              v-if="currentPage > 1" 
              @click="previousPage" 
              class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 md:py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base touch-manipulation"
            >
              Previous
            </button>
            
            <div class="flex items-center space-x-2">
              <span class="text-gray-400 text-xs md:text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
            </div>
            
            <button 
              v-if="currentPage < totalPages" 
              @click="nextPage" 
              class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 md:py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base touch-manipulation"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div 
      v-if="showToast" 
      class="fixed top-4 right-4 left-4 sm:left-auto z-50 bg-green-600 text-white p-3 md:p-4 rounded-lg shadow-lg transition-all duration-300 text-sm md:text-base"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { ref, onMounted, computed } from 'vue';
import { user } from '../main';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const loading = ref(true);
    const bookings = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(8);
    const showToast = ref(false);
    const toastMessage = ref('');
    const router = useRouter();

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return bookings.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(bookings.value.length / itemsPerPage.value);
    });

    const formatDate = (timestamp) => {
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      return 'Unknown date';
    };

    const showToastMessage = (message) => {
      toastMessage.value = message;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const watchMovie = (booking) => {
      // Navigate back to home and show movie details
      router.push('/');
      showToastMessage(`Playing ${booking.title}...`);
    };

    const removeFromList = async (booking) => {
      try {
        await db.collection('bookings').doc(booking.id).delete();
        bookings.value = bookings.value.filter(b => b.id !== booking.id);
        showToastMessage(`${booking.title} removed from your list`);
        
        // Adjust current page if necessary
        if (paginatedBookings.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      } catch (error) {
        console.error('Error removing booking:', error);
        showToastMessage('Failed to remove movie. Please try again.');
      }
    };

    onMounted(async () => {
      if (!user.value) {
        router.push('/login');
        return;
      }

      try {
        const bookingQuery = await db.collection('bookings').where('userId', '==', user.value.uid).get();
        bookingQuery.forEach(doc => {
          let booking = doc.data();
          booking.id = doc.id;
          bookings.value.push(booking);
        });
        
        // Sort in JavaScript instead of Firestore to avoid index requirement
        bookings.value.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.seconds - a.timestamp.seconds;
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        loading.value = false;
      }
    });

    return { 
      bookings, 
      loading, 
      currentPage, 
      itemsPerPage, 
      paginatedBookings, 
      totalPages,
      nextPage, 
      previousPage,
      formatDate,
      watchMovie,
      removeFromList,
      showToast,
      toastMessage
    };
  }
}
</script>