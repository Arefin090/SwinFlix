export const MOVIE_GENRES = [
  'Action',
  'Comedy', 
  'Horror',
  'Romance',
  'Science Fiction',
  "Editor's Pick"
];

export const TMDB_GENRE_MAP = {
  'Action': 28,
  'Comedy': 35,
  'Horror': 27,
  'Romance': 10749,
  'Science Fiction': 878,
  "Editor's Pick": 16
};

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  WATCHLIST: '/booking-history'
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const AUTH_ERROR_MESSAGES = {
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};