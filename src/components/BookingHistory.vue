<template>
  <div class="flex flex-col justify-center items-center h-screen bg-history">
    <h1 class="text-4xl font-bold mb-8 text-center text-white">Booking History</h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-200"></div>
    </div>

    <div v-else-if="bookings.length === 0" class="flex justify-center items-center h-64 text-white">
      <p class="text-xl">You have no bookings yet.</p>
    </div>

    <div v-else class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
      <table class="w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-red-700 bg-red-400 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
              Movie Title
            </th>
            <th class="px-5 py-3 border-b-2 border-red-700 bg-red-400 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
              Booked on
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in paginatedBookings" :key="booking.id" class="hover:bg-rose-500 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white text-gray-700">
            <td class="px-5 py-5 border-b border-gray-700 text-sm">
              <div class="flex items-center">
                <div class="ml-3">
                  <p class="whitespace-no-wrap">
                    {{ booking.title }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-700 text-sm">
              <p class="whitespace-no-wrap">{{ booking.timestamp }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between items-center my-4">
        <button v-if="currentPage > 1" @click="previousPage" class="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded">
          Previous
        </button>
        <p class="text-white">Page {{ currentPage }}</p>
        <button v-if="currentPage * itemsPerPage < bookings.length" @click="nextPage" class="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import { ref, onMounted, computed } from 'vue';
import { user } from '../main';

export default {
  setup() {
    const loading = ref(true);
    const bookings = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return bookings.value.slice(start, end);
    });

    const nextPage = () => {
      currentPage.value++;
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    onMounted(async () => {
      const bookingQuery = await db.collection('bookings').where('userId', '==', user.value.uid).get();
      bookingQuery.forEach(doc => {
        let booking = doc.data();
        booking.id = doc.id;
        booking.timestamp = booking.timestamp.toDate().toLocaleString();
        bookings.value.push(booking);
      });
      loading.value = false;
    });

    return { bookings, loading, currentPage, itemsPerPage, paginatedBookings, nextPage, previousPage };
  }
}
</script>

<style scoped>
.bg-history {
background-image: url('@/assets/history2.jpg');
background-size: cover;
background-position: center;
}



</style>
