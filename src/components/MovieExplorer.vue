<template>
  <div class="relative min-h-screen bg-transparent select-none">
    <!-- <video
      class="fixed  w-auto min-w-full min-h-full max-w-none z-0 opacity-75"
      autoplay
      loop
      muted
    >
      <source :src="require('@/assets/avengers.mp4')" type="video/mp4" />
    </video> -->
    <div class="container mx-auto p-4 z-50 relative">
      <div class="flex justify-between items-center">
        <h1 class="text-5xl text-center font-bold mb-4 text-rose-500">SwinFlix</h1>
        <div class="relative inline-block text-left ml-auto">
          <div>
            <button type="button" class="inline-flex justify-center w-full shadow-lg transform transition-all duration-300 hover:scale-110 bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded" id="options-menu" aria-expanded="true" aria-haspopup="true" @click="showMenu = !showMenu">
              <span>Menu</span>
              <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 10a5 5 0 0110 0v.586l-.293-.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 10-1.414-1.414L15 10.586V10a5 5 0 00-10 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div v-show="showMenu" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div v-if="user" @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Logout</div>
              <router-link v-else to="/login" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Login</router-link>
              <router-link v-if="user" to="/booking-history" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Booking History</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <input
          v-model="search"
          @input="searchMovies"
          type="text"
          placeholder="Search for movies"
          class="w-full p-2 border border-rose-100 rounded-l"
        />
      </div>
      <div v-if="loading" class="text-center text-gray-800">
        <p>Loading movies...</p>
      </div>
      <div v-else>
        <h2 class="text-3xl font-bold mb-4 text-rose-300">Genre</h2>
        <div class="flex flex-wrap">
          <div 
            v-for="genre in genres" 
            :key="genre"
            
            class="m-2 cursor-pointer genre-box p-5 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-rose-600 hover:text-white" 
            @click="fetchMoviesByGenre(genre)"
          >
            {{ genre }}
          </div>
        </div>
        <div v-if="genreMovies && genreMovies.length">
          <h2 class="text-3xl font-bold mb-4 text-rose-500 mt-6">{{ selectedGenre }} Movies</h2>
        <div ref="genreMovieGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4" v-if="genreMovies && genreMovies.length">
          <MovieBooking
            v-for="movie in genreMovies"
            :key="movie.id"
            :movie="movie"
            :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          />
          </div>
        </div>
        <h2 class="text-3xl font-bold mb-4 text-ros-50 mt-6 text-rose-300">Latest Movies</h2>
        <div ref="latestMovieGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <MovieBooking
            v-for="movie in latestMovies"
            :key="movie.id"
            :movie="movie"
            :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            class="bg-white rounded shadow p-4"
          />
        </div>
        <h2 class="text-3xl font-bold mb-4 text-rose-300 mt-6">Popular Movies</h2>
        <div ref="popularMovieGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <MovieBooking
            v-for="movie in popularMovies"
            :key="movie.id"
            :movie="movie"
            :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            class="bg-white rounded shadow p-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>





<script>
import axios from "axios";
import MovieBooking from "./MovieBooking.vue";
import { auth, signOut } from '../firebase'; // Import auth and signOut
import { user } from '../main'; // Import user ref
import { useRouter } from 'vue-router'; // Import useRouter
//import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
  components: {
    MovieBooking,
    // Register Swiper components
    //Swiper,
    //SwiperSlide,
  },
  data() {
    return {
      search: "",
      latestMovies: null,
      popularMovies: null,
      genreMovies: null,
      selectedGenre: null, // Added this new property to keep track of selected genre
      loading: false,
      showMenu: false,
      genres: ['Action', 'Comedy', 'Horror', 'Romance', 'Science-Fiction', "Arefin's-Pick"] 
    };
  },
  setup() {
    const router = useRouter(); // Setup router

    const logout = async () => {
      try {
        await signOut(auth); // Sign the user out
        user.value = null; // Clear the user ref
        router.push('/'); // Redirect to MoVieExplorer page
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return { logout };
  },
  computed: {
    user() {
      return user.value;
    }
  },
  mounted() {
    this.fetchLatestMovies();
    this.fetchPopularMovies();
  },
  methods: {
    async searchMovies() {
      this.loading = true;
      if (this.search.trim() === "") {
        this.latestMovies = null;
        this.popularMovies = null;
        this.genreMovies = null;
        await this.fetchLatestMovies();
        await this.fetchPopularMovies();
      } else {
        await this.fetchMovies();
      }
      this.loading = false;
    },
    async fetchMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.VUE_APP_TMDB_API_KEY}&query=${this.search}`
        );
        this.latestMovies = response.data.results.slice(0, 8);
        this.popularMovies = null;
        this.genreMovies = null;
      } catch (error) {
        console.error("Error fetching movies:", error);
        alert("Error fetching movies. Please try again.");
      }
    },
    async fetchLatestMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US&page=1`
        );
        this.latestMovies = response.data.results.slice(0, 8);
      } catch (error) {
        console.error("Error fetching latest movies:", error);
        alert("Error fetching latest movies. Please try again.");
      }
    },
    async fetchPopularMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US&page=1`
        );
        this.popularMovies = response.data.results.slice(0, 8);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        alert("Error fetching popular movies. Please try again.");
      }
    },
    async fetchMoviesByGenre(genre) {
      this.selectedGenre = genre; // Set the selected genre

      
      let genreId = 28; 
      if (genre === 'Comedy') {
        genreId = 35; 
      } else if (genre === 'Horror') {
        genreId = 27; 
      } else if(genre=== 'Romance'){
        genreId = 10749
      } else if(genre==='Science-Fiction'){
        genreId = 878
      } else if(genre==="Arefin's-Pick"){
        genreId = 16
      }


      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.VUE_APP_TMDB_API_KEY}&with_genres=${genreId}`
        );
        this.genreMovies = response.data.results.slice(0, 8);
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
        alert("Error fetching movies by genre. Please try again.");
      }
    },
    
  
  },
  
};
</script>