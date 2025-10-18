import { Movie, WatchlistItem } from './api';

// Component Props Types
export interface MovieBookingProps {
  movie: Movie;
  imageUrl: string;
}

export interface MovieBookingEmits {
  'show-details': [movie: Movie];
  'play-trailer': [movie: Movie];
}

// Event Handler Types
export type MovieEventHandler = (movie: Movie) => void;
export type WatchlistEventHandler = (item: WatchlistItem) => void;

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  confirmPassword?: string;
}

// Modal Types
export interface MovieModal {
  visible: boolean;
  movie: Movie | null;
  trailerKey: string | null;
}

// Pagination Types
export interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// Search Types
export interface SearchFilters {
  query: string;
  genre: string | null;
  year: number | null;
  rating: number | null;
}

// Route Types
export interface RouteParams {
  [key: string]: string | undefined;
}

// Generic Component Types
export interface BaseComponentProps {
  loading?: boolean;
  error?: string | null;
}

export interface ListComponentProps<T> extends BaseComponentProps {
  items: T[];
  emptyMessage?: string;
}

// Utility Types
export type FormMode = 'Login' | 'Signup';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ImageSize = 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
