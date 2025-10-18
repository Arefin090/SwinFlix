import { createPinia } from 'pinia';

// Create and export the Pinia instance
export const pinia = createPinia();

// Export all stores for easy importing
export { useAuthStore } from './auth';
export { useMoviesStore } from './movies';
export { useWatchlistStore } from './watchlist';
export { useToastStore } from './toast';