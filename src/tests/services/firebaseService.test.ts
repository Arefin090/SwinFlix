import { describe, it, expect, beforeEach, vi } from 'vitest';
import firebaseService from '../../services/firebaseService';
import { auth } from '../../firebase';
import type { Movie } from '../../types';

// Mock Firebase modules
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
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

const mockUser = {
  uid: 'user-123',
  email: 'test@example.com',
};

describe('Firebase Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should sign in user', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
      } as any);

      const result = await firebaseService.signIn(
        'test@example.com',
        'password'
      );

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle sign in error', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const authError = { code: 'auth/user-not-found' };
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(authError);

      await expect(
        firebaseService.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('No account found with this email address.');
    });

    it('should sign up user', async () => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
      } as any);

      const result = await firebaseService.signUp(
        'test@example.com',
        'password'
      );

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle sign up error', async () => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const authError = { code: 'auth/email-already-in-use' };
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(authError);

      await expect(
        firebaseService.signUp('test@example.com', 'password')
      ).rejects.toThrow('An account with this email already exists.');
    });

    it('should sign out user', async () => {
      const { signOut } = await import('firebase/auth');
      vi.mocked(signOut).mockResolvedValue();

      await firebaseService.signOut();

      expect(signOut).toHaveBeenCalledWith(auth);
    });

    it('should handle sign out error', async () => {
      const { signOut } = await import('firebase/auth');
      vi.mocked(signOut).mockRejectedValue(new Error('Network error'));

      await expect(firebaseService.signOut()).rejects.toThrow(
        'Failed to sign out. Please try again.'
      );
    });

    it('should get current user', () => {
      // Mock auth.currentUser
      Object.defineProperty(auth, 'currentUser', {
        value: mockUser,
        writable: true,
      });

      const result = firebaseService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should handle auth state changes', async () => {
      const { onAuthStateChanged } = await import('firebase/auth');
      const callback = vi.fn();
      const unsubscribe = vi.fn();

      vi.mocked(onAuthStateChanged).mockReturnValue(unsubscribe);

      const result = firebaseService.onAuthStateChanged(callback);

      expect(onAuthStateChanged).toHaveBeenCalledWith(auth, callback);
      expect(result).toBe(unsubscribe);
    });
  });

  describe('Watchlist Management', () => {
    it('should add movie to watchlist', async () => {
      const { collection, addDoc } = await import('firebase/firestore');
      const mockDocRef = { id: 'watchlist-1' };

      vi.mocked(addDoc).mockResolvedValue(mockDocRef as any);

      const result = await firebaseService.addToWatchlist(
        'user-123',
        mockMovie
      );

      expect(collection).toHaveBeenCalled();
      expect(addDoc).toHaveBeenCalled();
      expect(result.id).toBe('watchlist-1');
      expect(result.movieId).toBe(1);
      expect(result.title).toBe('Test Movie');
    });

    it('should handle add to watchlist error', async () => {
      const { addDoc } = await import('firebase/firestore');
      vi.mocked(addDoc).mockRejectedValue(new Error('Firestore error'));

      await expect(
        firebaseService.addToWatchlist('user-123', mockMovie)
      ).rejects.toThrow('Failed to add movie to watchlist. Please try again.');
    });

    it('should get user watchlist', async () => {
      const { query, where, getDocs } = await import('firebase/firestore');
      const mockSnapshot = {
        forEach: vi.fn((callback) => {
          callback({
            id: 'watchlist-1',
            data: () => ({
              userId: 'user-123',
              movieId: 1,
              title: 'Test Movie',
              poster_path: '/test.jpg',
              timestamp: { seconds: 1640995200 },
              tickets: 1,
            }),
          });
        }),
      };

      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const result = await firebaseService.getWatchlist('user-123');

      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'user-123');
      expect(getDocs).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('watchlist-1');
    });

    it('should handle get watchlist error', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));

      await expect(firebaseService.getWatchlist('user-123')).rejects.toThrow(
        'Failed to fetch watchlist. Please try again.'
      );
    });

    it('should remove movie from watchlist', async () => {
      const { doc, deleteDoc } = await import('firebase/firestore');
      vi.mocked(deleteDoc).mockResolvedValue();

      await firebaseService.removeFromWatchlist('watchlist-1');

      expect(doc).toHaveBeenCalled();
      expect(deleteDoc).toHaveBeenCalled();
    });

    it('should handle remove from watchlist error', async () => {
      const { deleteDoc } = await import('firebase/firestore');
      vi.mocked(deleteDoc).mockRejectedValue(new Error('Firestore error'));

      await expect(
        firebaseService.removeFromWatchlist('watchlist-1')
      ).rejects.toThrow(
        'Failed to remove movie from watchlist. Please try again.'
      );
    });

    it('should check if movie is in watchlist', async () => {
      const { query, where, getDocs } = await import('firebase/firestore');
      const mockSnapshot = { empty: false };

      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const result = await firebaseService.isMovieInWatchlist('user-123', 1);

      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'user-123');
      expect(where).toHaveBeenCalledWith('movieId', '==', 1);
      expect(result).toBe(true);
    });

    it('should return false when checking watchlist fails', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'));

      const result = await firebaseService.isMovieInWatchlist('user-123', 1);

      expect(result).toBe(false);
    });
  });

  describe('Error Messages', () => {
    it('should return correct error messages for auth codes', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');

      const testCases = [
        {
          code: 'auth/user-not-found',
          expected: 'No account found with this email address.',
        },
        {
          code: 'auth/wrong-password',
          expected: 'Incorrect password. Please try again.',
        },
        {
          code: 'auth/email-already-in-use',
          expected: 'An account with this email already exists.',
        },
        {
          code: 'auth/weak-password',
          expected: 'Password should be at least 6 characters long.',
        },
        {
          code: 'auth/invalid-email',
          expected: 'Please enter a valid email address.',
        },
        {
          code: 'auth/unknown-error',
          expected: 'An unexpected error occurred. Please try again.',
        },
      ];

      for (const testCase of testCases) {
        vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
          code: testCase.code,
        });

        await expect(
          firebaseService.signIn('test@example.com', 'password')
        ).rejects.toThrow(testCase.expected);
      }
    });
  });
});
