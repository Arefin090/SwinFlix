<template>
  <div class="relative min-h-screen bg-black">
    <!-- Netflix-style Hero Section -->
    <div v-if="featuredMovie" class="relative h-screen w-full overflow-hidden">
      <!-- Movie Backdrop -->
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="`background-image: url('https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}')`"
      ></div>
      
      <!-- Gradient Overlays -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40 md:from-black/90 md:via-black/50 md:to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
      
      <!-- Navigation Bar -->
      <nav class="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent">
        <div class="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            FinnFlix
          </h1>
          
          <div class="relative">
            <button 
              @click="showMenu = !showMenu"
              class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-2 md:px-4 rounded-lg transition-all duration-300"
            >
              <span class="text-white text-sm md:text-base">Menu</span>
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-show="showMenu" class="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl">
              <div class="py-2">
                <div v-if="user" @click="logout" class="px-4 py-2 text-white hover:bg-red-500/20 cursor-pointer transition-colors">
                  Logout
                </div>
                <router-link v-else to="/login" class="block px-4 py-2 text-white hover:bg-blue-500/20 transition-colors">
                  Login
                </router-link>
                <router-link v-if="user" to="/booking-history" class="block px-4 py-2 text-white hover:bg-green-500/20 transition-colors">
                  My List
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Hero Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="px-4 sm:px-6 md:px-8 w-full max-w-4xl">
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {{ featuredMovie.title }}
          </h2>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg md:max-w-2xl leading-relaxed">
            {{ featuredMovie.overview }}
          </p>
          
          <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
            <button 
              @click="playTrailer(featuredMovie)"
              class="bg-white text-black font-bold py-3 px-6 md:py-4 md:px-8 rounded flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play</span>
            </button>
            <button 
              @click="showMovieDetails(featuredMovie)"
              class="bg-gray-600/80 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded backdrop-blur-sm hover:bg-gray-500/80 transition-all duration-300 transform hover:scale-105"
            >
              More Info
            </button>
          </div>
          
          <div class="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm">
            <span class="bg-yellow-500 text-black px-2 py-1 rounded font-bold">
              ⭐ {{ featuredMovie.vote_average?.toFixed(1) }}
            </span>
            <span class="text-gray-400">{{ featuredMovie.release_date?.substring(0, 4) }}</span>
            <span class="border border-gray-400 text-gray-400 px-2 py-1 rounded text-xs">HD</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Sections -->
    <div class="relative bg-black">
      <!-- Search Section -->
      <div class="px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div class="max-w-2xl mx-auto relative">
          <input
            v-model="search"
            @input="searchMovies"
            type="text"
            placeholder="Search for movies..."
            class="w-full p-3 md:p-4 pl-10 md:pl-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm md:text-base"
          />
          <div class="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
          <span class="text-white text-lg">Loading movies...</span>
        </div>
      </div>

      <!-- Content Sections -->
      <div v-else class="px-4 sm:px-6 md:px-8 space-y-12 md:space-y-16">
        <!-- Genre Selection -->
        <section>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Browse by Genre</h2>
          <div class="flex flex-wrap gap-2 md:gap-4">
            <button
              v-for="genre in genres"
              :key="genre"
              @click="fetchMoviesByGenre(genre)"
              class="bg-gray-800 hover:bg-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium text-sm md:text-base"
            >
              {{ genre }}
            </button>
          </div>
        </section>

        <!-- Selected Genre Movies -->
        <section v-if="genreMovies && genreMovies.length">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">{{ selectedGenre }} Movies</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            <MovieBooking
              v-for="movie in genreMovies"
              :key="movie.id"
              :movie="movie"
              :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              @show-details="showMovieDetails"
              @play-trailer="playTrailer"
            />
          </div>
        </section>

        <!-- Now Playing -->
        <section>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Now Playing</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            <MovieBooking
              v-for="movie in latestMovies"
              :key="movie.id"
              :movie="movie"
              :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              @show-details="showMovieDetails"
              @play-trailer="playTrailer"
            />
          </div>
        </section>

        <!-- Popular Movies -->
        <section>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Popular Movies</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            <MovieBooking
              v-for="movie in popularMovies"
              :key="movie.id"
              :movie="movie"
              :imageUrl="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              @show-details="showMovieDetails"
              @play-trailer="playTrailer"
            />
          </div>
        </section>
      </div>
    </div>

    <!-- Movie Details Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" @click="closeModal">
      <div class="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="relative">
          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-gray-800/90 hover:bg-gray-700 text-white rounded-full p-2 sm:p-3 transition-all duration-200 shadow-lg"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Trailer Video -->
          <div v-if="selectedMovieTrailer" class="relative aspect-video rounded-t-2xl overflow-hidden">
            <iframe
              :src="`https://www.youtube.com/embed/${selectedMovieTrailer}?autoplay=1&rel=0`"
              class="w-full h-full"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
          </div>

          <!-- Movie Info -->
          <div v-if="selectedMovie" class="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
            <div class="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
              <div class="flex-1 min-w-0 order-2 sm:order-1">
                <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">{{ selectedMovie.title }}</h3>
                <div class="flex items-center space-x-3 md:space-x-4 text-xs sm:text-sm mb-4 md:mb-6">
                  <span class="bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">
                    ⭐ {{ selectedMovie.vote_average?.toFixed(1) }}
                  </span>
                  <span class="text-gray-400 font-medium">{{ selectedMovie.release_date?.substring(0, 4) }}</span>
                  <span class="border border-gray-400 text-gray-400 px-2 py-1 rounded-full text-xs font-medium">HD</span>
                </div>
                <p class="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">{{ selectedMovie.overview }}</p>
              </div>
              <img 
                :src="`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`" 
                :alt="selectedMovie.title"
                class="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-60 object-cover rounded-xl shadow-lg flex-shrink-0 order-1 sm:order-2 mx-auto sm:mx-0"
              >
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-700">
              <button 
                v-if="!selectedMovieTrailer"
                @click="playTrailer(selectedMovie)"
                class="bg-white text-black font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg flex items-center space-x-2 md:space-x-3 hover:bg-gray-200 transition-all transform hover:scale-105 text-sm md:text-base"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Play Trailer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MovieBooking from "./MovieBooking.vue";
import { auth, signOut } from '../firebase';
import { user } from '../main';
import { useRouter } from 'vue-router';

export default {
  components: {
    MovieBooking,
  },
  data() {
    return {
      search: "",
      latestMovies: [],
      popularMovies: [],
      genreMovies: [],
      selectedGenre: null,
      loading: false,
      showMenu: false,
      genres: ['Action', 'Comedy', 'Horror', 'Romance', 'Science Fiction', "Editor's Pick"],
      featuredMovie: null,
      showModal: false,
      selectedMovie: null,
      selectedMovieTrailer: null
    };
  },
  setup() {
    const router = useRouter();

    const logout = async () => {
      try {
        await signOut(auth);
        user.value = null;
        router.push('/');
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
    this.fetchFeaturedMovie();
  },
  methods: {
    async searchMovies() {
      this.loading = true;
      if (this.search.trim() === "") {
        this.latestMovies = [];
        this.popularMovies = [];
        this.genreMovies = [];
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
        this.latestMovies = response.data.results.slice(0, 12);
        this.popularMovies = [];
        this.genreMovies = [];
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },

    async fetchLatestMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US&page=1`
        );
        this.latestMovies = response.data.results.slice(0, 12);
      } catch (error) {
        console.error("Error fetching latest movies:", error);
      }
    },

    async fetchPopularMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US&page=1`
        );
        this.popularMovies = response.data.results.slice(0, 12);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    },

    async fetchMoviesByGenre(genre) {
      this.selectedGenre = genre;
      
      const genreMap = {
        'Action': 28,
        'Comedy': 35,
        'Horror': 27,
        'Romance': 10749,
        'Science Fiction': 878,
        "Editor's Pick": 16
      };

      const genreId = genreMap[genre] || 28;

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.VUE_APP_TMDB_API_KEY}&with_genres=${genreId}`
        );
        this.genreMovies = response.data.results.slice(0, 12);
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
      }
    },
    
    async fetchFeaturedMovie() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US&page=1`
        );
        const movies = response.data.results.filter(movie => movie.backdrop_path);
        const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 10));
        this.featuredMovie = movies[randomIndex];
      } catch (error) {
        console.error("Error fetching featured movie:", error);
      }
    },
    
    scrollToMovies() {
      const firstSection = document.querySelector('section');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    async fetchMovieTrailer(movieId) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.VUE_APP_TMDB_API_KEY}&language=en-US`
        );
        const trailer = response.data.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        return trailer ? trailer.key : null;
      } catch (error) {
        console.error("Error fetching movie trailer:", error);
        return null;
      }
    },

    async playTrailer(movie) {
      const trailerKey = await this.fetchMovieTrailer(movie.id);
      this.selectedMovie = movie;
      this.selectedMovieTrailer = trailerKey;
      this.showModal = true;
    },

    showMovieDetails(movie) {
      this.selectedMovie = movie;
      this.selectedMovieTrailer = null;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedMovie = null;
      this.selectedMovieTrailer = null;
    },

    openRandomMovie() {
      if (this.popularMovies && this.popularMovies.length > 0) {
        const randomMovie = this.popularMovies[Math.floor(Math.random() * this.popularMovies.length)];
        this.playTrailer(randomMovie);
      }
    }
  },
};
</script>