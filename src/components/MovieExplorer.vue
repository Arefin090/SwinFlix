<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 select-none">
    <!-- <video
      class="fixed  w-auto min-w-full min-h-full max-w-none z-0 opacity-75"
      autoplay
      loop
      muted
    >
      <source :src="require('@/assets/avengers.mp4')" type="video/mp4" />
    </video> -->
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
    
    <div class="container mx-auto p-6 z-50 relative">
      <div class="flex justify-between items-center">
        <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">SwinFlix</h1>
        <div class="relative inline-block text-left ml-auto">
          <div>
            <button type="button" class="inline-flex justify-center w-full shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 transform transition-all duration-300 hover:scale-110 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl" id="options-menu" aria-expanded="true" aria-haspopup="true" @click="showMenu = !showMenu">
              <span>Menu</span>
              <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 10a5 5 0 0110 0v.586l-.293-.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 10-1.414-1.414L15 10.586V10a5 5 0 00-10 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div v-show="showMenu" class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl backdrop-blur-md bg-black/80 border border-white/20 ring-1 ring-white/10">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div v-if="user" @click="logout" class="block px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1" role="menuitem">Logout</div>
              <router-link v-else to="/login" class="block px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-blue-400 transition-all duration-200 rounded-lg mx-2 my-1" role="menuitem">Login</router-link>
              <router-link v-if="user" to="/booking-history" class="block px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-green-400 transition-all duration-200 rounded-lg mx-2 my-1" role="menuitem">Booking History</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-8">
        <div class="relative max-w-2xl mx-auto">
          <input
            v-model="search"
            @input="searchMovies"
            type="text"
            placeholder="Search for movies..."
            class="w-full p-4 pl-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
          />
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-center text-white">
        <div class="inline-flex items-center space-x-2">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p class="text-lg">Loading movies...</p>
        </div>
      </div>
      <div v-else>
        <h2 class="text-4xl font-bold mb-6 text-white">Explore by Genre</h2>
        <div class="flex flex-wrap">
          <div 
            v-for="genre in genres" 
            :key="genre"
            
            class="m-3 cursor-pointer genre-box p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:border-red-500/50 text-white font-semibold text-lg" 
            @click="fetchMoviesByGenre(genre)"
          >
            {{ genre }}
          </div>
        </div>
        <div v-if="genreMovies && genreMovies.length">
          <h2 class="text-4xl font-bold mb-6 mt-12 text-white bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">{{ selectedGenre }} Movies</h2>
        <div ref="genreMovieGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8" v-if="genreMovies && genreMovies.length">
          <MovieBooking
            v-for="movie in genreMovies"
            :key="movie.id"
            :movie="movie"
            :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          />
          </div>
        </div>
        <h2 class="text-4xl font-bold mb-6 mt-12 text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Latest Movies</h2>
        <div ref="latestMovieGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
          <MovieBooking
            v-for="movie in latestMovies"
            :key="movie.id"
            :movie="movie"
            :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            class="movie-card-wrapper"
          />
        </div>
        <h2 class="text-4xl font-bold mb-6 mt-12 text-white bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Popular Movies</h2>
        <div ref="popularMovieGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
          <MovieBooking
            v-for="movie in popularMovies"
            :key="movie.id"
            :movie="movie"
            :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            class="movie-card-wrapper"
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