import { defineStore } from 'pinia';
import tmdbApi, { TMDBService } from '../services/tmdbApi';
import { Movie, MoviesState, ImageSize, BackdropSize } from '../types';

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    // Movie collections
    popularMovies: [],
    nowPlayingMovies: [],
    genreMovies: [],
    searchResults: [],
    featuredMovie: null,
    
    // UI state
    loading: false,
    error: null,
    searchQuery: '',
    selectedGenre: null,
    
    // Cache timestamps
    lastFetchTimes: {
      popular: null,
      nowPlaying: null,
      genre: null
    }
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    hasMovies: (state) => state.searchResults.length > 0,
    hasPopularMovies: (state) => state.popularMovies.length > 0,
    hasNowPlayingMovies: (state) => state.nowPlayingMovies.length > 0,
    hasGenreMovies: (state) => state.genreMovies.length > 0,
    isSearching: (state) => state.searchQuery.trim().length > 0,
    
    // Get movies based on current state
    currentMovies: (state) => {
      if (state.searchQuery.trim()) {
        return state.searchResults;
      }
      if (state.genreMovies.length > 0) {
        return state.genreMovies;
      }
      return state.popularMovies;
    }
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

    setSearchQuery(query: string): void {
      this.searchQuery = query;
    },

    setSelectedGenre(genre: string | null): void {
      this.selectedGenre = genre;
    },

    // Cache management
    isCacheValid(type: keyof MoviesState['lastFetchTimes'], maxAgeMinutes = 10): boolean {
      const lastFetch = this.lastFetchTimes[type];
      if (!lastFetch) return false;
      
      const now = new Date().getTime();
      const maxAge = maxAgeMinutes * 60 * 1000;
      return (now - lastFetch) < maxAge;
    },

    updateCacheTime(type: keyof MoviesState['lastFetchTimes']): void {
      this.lastFetchTimes[type] = new Date().getTime();
    },

    // API actions
    async fetchPopularMovies(page = 1, useCache = true): Promise<Movie[]> {
      if (useCache && this.isCacheValid('popular') && this.popularMovies.length > 0) {
        return this.popularMovies;
      }

      try {
        this.setLoading(true);
        this.clearError();
        
        const data = await tmdbApi.getPopularMovies(page);
        this.popularMovies = data.results?.slice(0, 12) || [];
        this.updateCacheTime('popular');
        
        // Set featured movie if not already set
        if (!this.featuredMovie && data.results?.length > 0) {
          const moviesWithBackdrop = data.results.filter(movie => movie.backdrop_path);
          if (moviesWithBackdrop.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(moviesWithBackdrop.length, 10));
            this.featuredMovie = moviesWithBackdrop[randomIndex];
          }
        }
        
        return this.popularMovies;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchNowPlayingMovies(page = 1, useCache = true): Promise<Movie[]> {
      if (useCache && this.isCacheValid('nowPlaying') && this.nowPlayingMovies.length > 0) {
        return this.nowPlayingMovies;
      }

      try {
        this.setLoading(true);
        this.clearError();
        
        const data = await tmdbApi.getNowPlayingMovies(page);
        this.nowPlayingMovies = data.results?.slice(0, 12) || [];
        this.updateCacheTime('nowPlaying');
        
        return this.nowPlayingMovies;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async searchMovies(query: string, page = 1): Promise<Movie[]> {
      if (!query.trim()) {
        this.searchResults = [];
        this.setSearchQuery('');
        return [];
      }

      try {
        this.setLoading(true);
        this.clearError();
        this.setSearchQuery(query);
        
        const data = await tmdbApi.searchMovies(query, page);
        this.searchResults = data.results?.slice(0, 12) || [];
        
        return this.searchResults;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchMoviesByGenre(genre: string): Promise<Movie[]> {
      try {
        this.setLoading(true);
        this.clearError();
        this.setSelectedGenre(genre);
        
        const genreId = TMDBService.genreMap[genre] || 28;
        const data = await tmdbApi.getMoviesByGenre(genreId);
        this.genreMovies = data.results?.slice(0, 12) || [];
        this.updateCacheTime('genre');
        
        return this.genreMovies;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchMovieTrailer(movieId: number): Promise<string | null> {
      try {
        const data = await tmdbApi.getMovieVideos(movieId);
        return tmdbApi.getTrailerKey(data);
      } catch (error) {
        console.error('Error fetching trailer:', error);
        return null;
      }
    },

    // Utility actions
    getMovieImageUrl(path: string | null, size: ImageSize | BackdropSize = 'w500'): string | null {
      return tmdbApi.getImageUrl(path, size);
    },

    async initializeData(): Promise<void> {
      await Promise.all([
        this.fetchPopularMovies(),
        this.fetchNowPlayingMovies()
      ]);
    },

    clearSearchResults(): void {
      this.searchResults = [];
      this.setSearchQuery('');
    },

    clearGenreMovies(): void {
      this.genreMovies = [];
      this.setSelectedGenre(null);
    },

    // Reset store state
    $reset(): void {
      this.popularMovies = [];
      this.nowPlayingMovies = [];
      this.genreMovies = [];
      this.searchResults = [];
      this.featuredMovie = null;
      this.loading = false;
      this.error = null;
      this.searchQuery = '';
      this.selectedGenre = null;
      this.lastFetchTimes = {
        popular: null,
        nowPlaying: null,
        genre: null
      };
    }
  }
});