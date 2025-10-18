import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWatchlistStore } from '../../stores/watchlist';
import { useAuthStore } from '../../stores/auth';
import firebaseService from '../../services/firebaseService';
import type { Movie, WatchlistItem } from '../../types';

// Mock the firebase service
vi.mock('../../services/firebaseService', () => ({
  default: {
    getWatchlist: vi.fn(),
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
    isMovieInWatchlist: vi.fn(),
  },
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 35],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  popularity: 100.5,
  video: false,
};

const mockWatchlistItem: WatchlistItem = {
  id: 'watchlist-1',
  userId: 'user-123',
  movieId: 1,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  timestamp: new Date(),
  tickets: 1,
};

describe('Watchlist Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const watchlistStore = useWatchlistStore();

    expect(watchlistStore.items).toEqual([]);
    expect(watchlistStore.loading).toBe(false);
    expect(watchlistStore.error).toBe(null);
    expect(watchlistStore.lastFetchTime).toBe(null);
  });

  it('should have correct getters', () => {
    const watchlistStore = useWatchlistStore();

    expect(watchlistStore.watchlist).toEqual([]);
    expect(watchlistStore.watchlistCount).toBe(0);
    expect(watchlistStore.hasWatchlist).toBe(false);
    expect(watchlistStore.isLoading).toBe(false);
    expect(watchlistStore.hasError).toBe(false);
  });

  it('should set loading state', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setLoading(true);
    expect(watchlistStore.loading).toBe(true);
    expect(watchlistStore.isLoading).toBe(true);
  });

  it('should set error state', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setError('Test error');
    expect(watchlistStore.error).toBe('Test error');
    expect(watchlistStore.hasError).toBe(true);

    watchlistStore.clearError();
    expect(watchlistStore.error).toBe(null);
    expect(watchlistStore.hasError).toBe(false);
  });

  it('should set items', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setItems([mockWatchlistItem]);
    expect(watchlistStore.items).toEqual([mockWatchlistItem]);
    expect(watchlistStore.watchlistCount).toBe(1);
    expect(watchlistStore.hasWatchlist).toBe(true);
  });

  it('should add item', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.addItem(mockWatchlistItem);
    expect(watchlistStore.items).toEqual([mockWatchlistItem]);
    expect(watchlistStore.watchlistCount).toBe(1);
  });

  it('should remove item', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setItems([mockWatchlistItem]);
    watchlistStore.removeItem('watchlist-1');
    expect(watchlistStore.items).toEqual([]);
    expect(watchlistStore.watchlistCount).toBe(0);
  });

  it('should check if movie is in watchlist', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setItems([mockWatchlistItem]);
    expect(watchlistStore.isMovieInWatchlist(1)).toBe(true);
    expect(watchlistStore.isMovieInWatchlist(2)).toBe(false);
  });

  it('should get movie from watchlist', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setItems([mockWatchlistItem]);
    expect(watchlistStore.getMovieFromWatchlist(1)).toEqual(mockWatchlistItem);
    expect(watchlistStore.getMovieFromWatchlist(2)).toBeUndefined();
  });

  it('should check cache validity', () => {
    const watchlistStore = useWatchlistStore();

    // Cache should be invalid initially
    expect(watchlistStore.isCacheValid()).toBe(false);

    // Update cache time
    watchlistStore.updateLastFetchTime();
    expect(watchlistStore.isCacheValid()).toBe(true);
  });

  it('should fetch watchlist for authenticated user', async () => {
    const watchlistStore = useWatchlistStore();
    const authStore = useAuthStore();

    // Mock authenticated user
    authStore.setUser({ uid: 'user-123', email: 'test@example.com' } as any);
    vi.mocked(firebaseService.getWatchlist).mockResolvedValue([
      mockWatchlistItem,
    ]);

    const result = await watchlistStore.fetchWatchlist();

    expect(firebaseService.getWatchlist).toHaveBeenCalledWith('user-123');
    expect(watchlistStore.items).toEqual([mockWatchlistItem]);
    expect(result).toEqual([mockWatchlistItem]);
  });

  it('should return empty array for unauthenticated user', async () => {
    const watchlistStore = useWatchlistStore();

    const result = await watchlistStore.fetchWatchlist();

    expect(watchlistStore.items).toEqual([]);
    expect(result).toEqual([]);
    expect(firebaseService.getWatchlist).not.toHaveBeenCalled();
  });

  it('should add movie to watchlist', async () => {
    const watchlistStore = useWatchlistStore();
    const authStore = useAuthStore();

    // Mock authenticated user
    authStore.setUser({ uid: 'user-123', email: 'test@example.com' } as any);
    vi.mocked(firebaseService.addToWatchlist).mockResolvedValue(
      mockWatchlistItem
    );

    const result = await watchlistStore.addToWatchlist(mockMovie);

    expect(firebaseService.addToWatchlist).toHaveBeenCalledWith(
      'user-123',
      mockMovie
    );
    expect(watchlistStore.items).toEqual([mockWatchlistItem]);
    expect(result).toEqual(mockWatchlistItem);
  });

  it('should prevent adding duplicate movies', async () => {
    const watchlistStore = useWatchlistStore();
    const authStore = useAuthStore();

    // Mock authenticated user and existing watchlist
    authStore.setUser({ uid: 'user-123', email: 'test@example.com' } as any);
    watchlistStore.setItems([mockWatchlistItem]);

    await expect(watchlistStore.addToWatchlist(mockMovie)).rejects.toThrow(
      'Movie is already in your watchlist'
    );
    expect(firebaseService.addToWatchlist).not.toHaveBeenCalled();
  });

  it('should remove movie from watchlist', async () => {
    const watchlistStore = useWatchlistStore();
    const authStore = useAuthStore();

    // Mock authenticated user and existing watchlist
    authStore.setUser({ uid: 'user-123', email: 'test@example.com' } as any);
    watchlistStore.setItems([mockWatchlistItem]);
    vi.mocked(firebaseService.removeFromWatchlist).mockResolvedValue();

    await watchlistStore.removeFromWatchlist('watchlist-1');

    expect(firebaseService.removeFromWatchlist).toHaveBeenCalledWith(
      'watchlist-1'
    );
    expect(watchlistStore.items).toEqual([]);
  });

  it('should toggle watchlist - add movie', async () => {
    const watchlistStore = useWatchlistStore();
    const authStore = useAuthStore();

    // Mock authenticated user
    authStore.setUser({ uid: 'user-123', email: 'test@example.com' } as any);
    vi.mocked(firebaseService.addToWatchlist).mockResolvedValue(
      mockWatchlistItem
    );

    const result = await watchlistStore.toggleWatchlist(mockMovie);

    expect(result).toBe(true); // Added
    expect(watchlistStore.items).toEqual([mockWatchlistItem]);
  });

  it('should toggle watchlist - remove movie', async () => {
    const watchlistStore = useWatchlistStore();
    const authStore = useAuthStore();

    // Mock authenticated user and existing watchlist
    authStore.setUser({ uid: 'user-123', email: 'test@example.com' } as any);
    watchlistStore.setItems([mockWatchlistItem]);
    vi.mocked(firebaseService.removeFromWatchlist).mockResolvedValue();

    const result = await watchlistStore.toggleWatchlist(mockMovie);

    expect(result).toBe(false); // Removed
    expect(watchlistStore.items).toEqual([]);
  });

  it('should clear watchlist', () => {
    const watchlistStore = useWatchlistStore();

    watchlistStore.setItems([mockWatchlistItem]);
    watchlistStore.clearWatchlist();

    expect(watchlistStore.items).toEqual([]);
  });

  it('should reset store state', () => {
    const watchlistStore = useWatchlistStore();

    // Set some state
    watchlistStore.setItems([mockWatchlistItem]);
    watchlistStore.setError('Some error');
    watchlistStore.setLoading(true);

    // Reset
    watchlistStore.$reset();

    expect(watchlistStore.items).toEqual([]);
    expect(watchlistStore.error).toBe(null);
    expect(watchlistStore.loading).toBe(false);
    expect(watchlistStore.lastFetchTime).toBe(null);
  });
});
