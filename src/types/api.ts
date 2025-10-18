// TMDB API Response Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  budget: number;
  revenue: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
  status: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBVideosResponse {
  id: number;
  results: MovieVideo[];
}

// Firebase/Watchlist Types
export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: number;
  title: string;
  poster_path: string | null;
  timestamp: any; // Firebase Timestamp
  tickets?: number;
}

// Auth Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Error Types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

// Toast Types
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  timestamp: number;
}

// Store State Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface MoviesState {
  popularMovies: Movie[];
  nowPlayingMovies: Movie[];
  genreMovies: Movie[];
  searchResults: Movie[];
  featuredMovie: Movie | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedGenre: string | null;
  lastFetchTimes: {
    popular: number | null;
    nowPlaying: number | null;
    genre: number | null;
  };
}

export interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

export interface ToastState {
  toasts: Toast[];
  nextId: number;
}