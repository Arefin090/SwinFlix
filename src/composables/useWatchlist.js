import { ref, computed } from 'vue';
import firebaseService from '../services/firebaseService';
import { useAuth } from './useAuth';

export function useWatchlist() {
  const { userId, isAuthenticated } = useAuth();
  
  const watchlist = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const clearError = () => {
    error.value = null;
  };

  const setLoading = (state) => {
    loading.value = state;
  };

  const handleError = (err, context = '') => {
    console.error(`Watchlist error ${context}:`, err);
    error.value = err.message || 'An unexpected error occurred';
  };

  const fetchWatchlist = async () => {
    if (!isAuthenticated.value) {
      watchlist.value = [];
      return;
    }

    try {
      setLoading(true);
      clearError();
      
      const data = await firebaseService.getWatchlist(userId.value);
      watchlist.value = data;
    } catch (err) {
      handleError(err, 'fetching watchlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!isAuthenticated.value) {
      throw new Error('Please sign in to add movies to your watchlist');
    }

    try {
      setLoading(true);
      clearError();
      
      const booking = await firebaseService.addToWatchlist(userId.value, movie);
      watchlist.value.unshift(booking);
      
      return booking;
    } catch (err) {
      handleError(err, 'adding to watchlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (bookingId) => {
    if (!isAuthenticated.value) {
      throw new Error('Please sign in to manage your watchlist');
    }

    try {
      setLoading(true);
      clearError();
      
      await firebaseService.removeFromWatchlist(bookingId);
      watchlist.value = watchlist.value.filter(item => item.id !== bookingId);
    } catch (err) {
      handleError(err, 'removing from watchlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isMovieInWatchlist = async (movieId) => {
    if (!isAuthenticated.value) return false;

    try {
      return await firebaseService.isMovieInWatchlist(userId.value, movieId);
    } catch (err) {
      console.error('Error checking watchlist:', err);
      return false;
    }
  };

  const isMovieInWatchlistSync = (movieId) => {
    return watchlist.value.some(item => item.movieId === movieId);
  };

  const clearWatchlist = () => {
    watchlist.value = [];
  };

  return {
    // State
    watchlist: computed(() => watchlist.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Computed
    watchlistCount: computed(() => watchlist.value.length),
    hasWatchlist: computed(() => watchlist.value.length > 0),

    // Actions
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isMovieInWatchlist,
    isMovieInWatchlistSync,
    clearWatchlist,
    clearError
  };
}