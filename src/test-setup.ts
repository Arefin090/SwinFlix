import { vi } from 'vitest';

// Mock Firebase
vi.mock('./firebase', () => ({
  auth: {
    currentUser: null,
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  },
  db: {
    collection: vi.fn(() => ({
      add: vi.fn(),
      doc: vi.fn(() => ({
        delete: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
      })),
      where: vi.fn(() => ({
        get: vi.fn(() => ({
          empty: true,
          forEach: vi.fn(),
        })),
      })),
      get: vi.fn(() => ({
        empty: true,
        forEach: vi.fn(),
      })),
    })),
  },
}));

// Mock TMDB API key
process.env.VUE_APP_TMDB_API_KEY = 'test-api-key';

// Mock axios for TMDB API calls
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
