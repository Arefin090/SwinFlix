import { ref, computed } from 'vue';
import tmdbApi from '../services/tmdbApi';

export function useMovies() {
  const movies = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchQuery = ref('');

  const popularMovies = ref([]);
  const nowPlayingMovies = ref([]);
  const genreMovies = ref([]);
  const selectedGenre = ref(null);
  const featuredMovie = ref(null);

  const clearError = () => {
    error.value = null;
  };

  const setLoading = (state) => {
    loading.value = state;
  };

  const handleError = (err, context = '') => {
    console.error(`Error ${context}:`, err);
    error.value = err.message || 'An unexpected error occurred';
  };

  const fetchPopularMovies = async (page = 1) => {
    try {
      setLoading(true);
      clearError();

      const data = await tmdbApi.getPopularMovies(page);
      popularMovies.value = data.results?.slice(0, 12) || [];

      if (!featuredMovie.value && data.results?.length > 0) {
        const moviesWithBackdrop = data.results.filter(
          (movie) => movie.backdrop_path
        );
        if (moviesWithBackdrop.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * Math.min(moviesWithBackdrop.length, 10)
          );
          featuredMovie.value = moviesWithBackdrop[randomIndex];
        }
      }
    } catch (err) {
      handleError(err, 'fetching popular movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchNowPlayingMovies = async (page = 1) => {
    try {
      setLoading(true);
      clearError();

      const data = await tmdbApi.getNowPlayingMovies(page);
      nowPlayingMovies.value = data.results?.slice(0, 12) || [];
    } catch (err) {
      handleError(err, 'fetching now playing movies');
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) {
      movies.value = [];
      return;
    }

    try {
      setLoading(true);
      clearError();
      searchQuery.value = query;

      const data = await tmdbApi.searchMovies(query, page);
      movies.value = data.results?.slice(0, 12) || [];
    } catch (err) {
      handleError(err, 'searching movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesByGenre = async (genre) => {
    try {
      setLoading(true);
      clearError();
      selectedGenre.value = genre;

      const genreId = tmdbApi.constructor.genreMap[genre] || 28;
      const data = await tmdbApi.getMoviesByGenre(genreId);
      genreMovies.value = data.results?.slice(0, 12) || [];
    } catch (err) {
      handleError(err, 'fetching movies by genre');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieTrailer = async (movieId) => {
    try {
      const data = await tmdbApi.getMovieVideos(movieId);
      return tmdbApi.getTrailerKey(data);
    } catch (err) {
      console.error('Error fetching trailer:', err);
      return null;
    }
  };

  const getMovieImageUrl = (path, size = 'w500') => {
    return tmdbApi.getImageUrl(path, size);
  };

  const initializeData = async () => {
    await Promise.all([fetchPopularMovies(), fetchNowPlayingMovies()]);
  };

  const clearGenreMovies = () => {
    genreMovies.value = [];
    selectedGenre.value = null;
  };

  const clearSearchResults = () => {
    movies.value = [];
    searchQuery.value = '';
  };

  return {
    // State
    movies,
    popularMovies,
    nowPlayingMovies,
    genreMovies,
    featuredMovie,
    selectedGenre,
    searchQuery,
    loading,
    error,

    // Actions
    fetchPopularMovies,
    fetchNowPlayingMovies,
    searchMovies,
    fetchMoviesByGenre,
    fetchMovieTrailer,
    initializeData,
    clearGenreMovies,
    clearSearchResults,
    clearError,
    getMovieImageUrl,

    // Computed
    hasMovies: computed(() => movies.value.length > 0),
    hasPopularMovies: computed(() => popularMovies.value.length > 0),
    hasNowPlayingMovies: computed(() => nowPlayingMovies.value.length > 0),
    hasGenreMovies: computed(() => genreMovies.value.length > 0),
    isSearching: computed(() => searchQuery.value.trim().length > 0),
  };
}
