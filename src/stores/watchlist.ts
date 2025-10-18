import { defineStore } from 'pinia';
import firebaseService from '../services/firebaseService';
import { useAuthStore } from './auth';
import { WatchlistState, WatchlistItem, Movie } from '../types';

export const useWatchlistStore = defineStore('watchlist', {
  state: (): WatchlistState => ({
    items: [],
    loading: false,
    error: null,
    lastFetchTime: null,
  }),

  getters: {
    watchlist: (state) => state.items,
    watchlistCount: (state) => state.items.length,
    hasWatchlist: (state) => state.items.length > 0,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,

    isMovieInWatchlist: (state) => {
      return (movieId: number) =>
        state.items.some((item) => item.movieId === movieId);
    },

    getMovieFromWatchlist: (state) => {
      return (movieId: number) =>
        state.items.find((item) => item.movieId === movieId);
    },
  },

  actions: {
    // State management
    setLoading(loading: boolean): void {
      this.loading = loading;
    },

    setError(error: string | null): void {
      this.error = error;
    },

    clearError(): void {
      this.error = null;
    },

    setItems(items: WatchlistItem[]): void {
      this.items = items;
    },

    addItem(item: WatchlistItem): void {
      this.items.unshift(item);
    },

    removeItem(itemId: string): void {
      this.items = this.items.filter((item) => item.id !== itemId);
    },

    updateLastFetchTime(): void {
      this.lastFetchTime = new Date().getTime();
    },

    // Cache management
    isCacheValid(maxAgeMinutes = 5): boolean {
      if (!this.lastFetchTime) return false;

      const now = new Date().getTime();
      const maxAge = maxAgeMinutes * 60 * 1000;
      return now - this.lastFetchTime < maxAge;
    },

    // API actions
    async fetchWatchlist(useCache = true): Promise<WatchlistItem[]> {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        this.setItems([]);
        return [];
      }

      if (useCache && this.isCacheValid() && this.items.length > 0) {
        return this.items;
      }

      try {
        this.setLoading(true);
        this.clearError();

        const watchlist = await firebaseService.getWatchlist(authStore.userId);
        this.setItems(watchlist);
        this.updateLastFetchTime();

        return this.items;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async addToWatchlist(movie: Movie): Promise<WatchlistItem> {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        throw new Error('Please sign in to add movies to your watchlist');
      }

      // Check if movie is already in watchlist
      if (this.isMovieInWatchlist(movie.id)) {
        throw new Error('Movie is already in your watchlist');
      }

      try {
        this.setLoading(true);
        this.clearError();

        const booking = await firebaseService.addToWatchlist(
          authStore.userId,
          movie
        );
        this.addItem(booking);

        return booking;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async removeFromWatchlist(bookingId: string): Promise<void> {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        throw new Error('Please sign in to manage your watchlist');
      }

      try {
        this.setLoading(true);
        this.clearError();

        await firebaseService.removeFromWatchlist(bookingId);
        this.removeItem(bookingId);
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async toggleWatchlist(movie: Movie): Promise<boolean> {
      if (this.isMovieInWatchlist(movie.id)) {
        const watchlistItem = this.getMovieFromWatchlist(movie.id);
        if (watchlistItem?.id) {
          await this.removeFromWatchlist(watchlistItem.id);
        }
        return false; // Removed
      } else {
        await this.addToWatchlist(movie);
        return true; // Added
      }
    },

    // Utility actions
    clearWatchlist(): void {
      this.setItems([]);
    },

    // Reset store state
    $reset(): void {
      this.items = [];
      this.loading = false;
      this.error = null;
      this.lastFetchTime = null;
    },
  },
});
