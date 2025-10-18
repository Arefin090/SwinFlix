import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import firebaseService from '../../services/firebaseService';

// Mock the firebase service
vi.mock('../../services/firebaseService', () => ({
  default: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const authStore = useAuthStore();

    expect(authStore.user).toBe(null);
    expect(authStore.loading).toBe(false);
    expect(authStore.error).toBe(null);
  });

  it('should have correct getters', () => {
    const authStore = useAuthStore();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.hasError).toBe(false);
    expect(authStore.userId).toBe('');
  });

  it('should set loading state', () => {
    const authStore = useAuthStore();

    authStore.setLoading(true);
    expect(authStore.loading).toBe(true);
    expect(authStore.isLoading).toBe(true);

    authStore.setLoading(false);
    expect(authStore.loading).toBe(false);
    expect(authStore.isLoading).toBe(false);
  });

  it('should set error state', () => {
    const authStore = useAuthStore();

    authStore.setError('Test error');
    expect(authStore.error).toBe('Test error');
    expect(authStore.hasError).toBe(true);

    authStore.clearError();
    expect(authStore.error).toBe(null);
    expect(authStore.hasError).toBe(false);
  });

  it('should set user state', () => {
    const authStore = useAuthStore();
    const mockUser = { uid: '123', email: 'test@example.com' };

    authStore.setUser(mockUser as any);
    expect(authStore.user).toEqual(mockUser);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.userId).toBe('123');
  });

  it('should handle successful sign in', async () => {
    const authStore = useAuthStore();
    const mockUser = { uid: '123', email: 'test@example.com' };

    vi.mocked(firebaseService.signIn).mockResolvedValue(mockUser as any);

    const result = await authStore.signIn('test@example.com', 'password');

    expect(firebaseService.signIn).toHaveBeenCalledWith(
      'test@example.com',
      'password'
    );
    expect(authStore.user).toEqual(mockUser);
    expect(authStore.error).toBe(null);
    expect(result).toEqual(mockUser);
  });

  it('should handle sign in error', async () => {
    const authStore = useAuthStore();
    const errorMessage = 'Invalid credentials';

    vi.mocked(firebaseService.signIn).mockRejectedValue(
      new Error(errorMessage)
    );

    await expect(
      authStore.signIn('test@example.com', 'wrongpassword')
    ).rejects.toThrow(errorMessage);
    expect(authStore.error).toBe(errorMessage);
    expect(authStore.user).toBe(null);
    expect(authStore.loading).toBe(false);
  });

  it('should handle successful sign up', async () => {
    const authStore = useAuthStore();
    const mockUser = { uid: '123', email: 'test@example.com' };

    vi.mocked(firebaseService.signUp).mockResolvedValue(mockUser as any);

    const result = await authStore.signUp('test@example.com', 'password');

    expect(firebaseService.signUp).toHaveBeenCalledWith(
      'test@example.com',
      'password'
    );
    expect(authStore.user).toEqual(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should handle sign out', async () => {
    const authStore = useAuthStore();
    // Set initial user
    authStore.setUser({ uid: '123', email: 'test@example.com' } as any);

    vi.mocked(firebaseService.signOut).mockResolvedValue();

    await authStore.signOut();

    expect(firebaseService.signOut).toHaveBeenCalled();
    expect(authStore.user).toBe(null);
  });

  it('should reset store state', () => {
    const authStore = useAuthStore();

    // Set some state
    authStore.setUser({ uid: '123', email: 'test@example.com' } as any);
    authStore.setError('Some error');
    authStore.setLoading(true);

    // Reset
    authStore.$reset();

    expect(authStore.user).toBe(null);
    expect(authStore.error).toBe(null);
    expect(authStore.loading).toBe(false);
  });
});
