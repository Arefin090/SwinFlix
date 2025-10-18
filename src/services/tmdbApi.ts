import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Movie, TMDBResponse, TMDBVideosResponse, ImageSize, BackdropSize } from '../types';

class TMDBService {
  private apiKey: string;
  private baseURL: string;
  private imageBaseURL: string;
  private client: AxiosInstance;

  constructor() {
    this.apiKey = process.env.VUE_APP_TMDB_API_KEY || '';
    this.baseURL = 'https://api.themoviedb.org/3';
    this.imageBaseURL = 'https://image.tmdb.org/t/p';
    
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      params: {
        api_key: this.apiKey,
        language: 'en-US'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('TMDB API Error:', error);
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded. Please try again later.');
        }
        return Promise.reject(error);
      }
    );
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await this.client.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch popular movies: ${error.message}`);
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await this.client.get('/movie/now_playing', {
        params: { page }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch now playing movies: ${error.message}`);
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await this.client.get('/search/movie', {
        params: { query, page }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to search movies: ${error.message}`);
    }
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<Movie>> {
    try {
      const response: AxiosResponse<TMDBResponse<Movie>> = await this.client.get('/discover/movie', {
        params: { with_genres: genreId, page }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch movies by genre: ${error.message}`);
    }
  }

  async getMovieVideos(movieId: number): Promise<TMDBVideosResponse> {
    try {
      const response: AxiosResponse<TMDBVideosResponse> = await this.client.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch movie videos: ${error.message}`);
    }
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    try {
      const response: AxiosResponse<Movie> = await this.client.get(`/movie/${movieId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
  }

  getImageUrl(path: string | null, size: ImageSize | BackdropSize = 'w500'): string | null {
    if (!path) return null;
    return `${this.imageBaseURL}/${size}${path}`;
  }

  getTrailerKey(videos: TMDBVideosResponse): string | null {
    const trailer = videos.results?.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer?.key || null;
  }

  static readonly genreMap: Record<string, number> = {
    'Action': 28,
    'Comedy': 35,
    'Horror': 27,
    'Romance': 10749,
    'Science Fiction': 878,
    "Editor's Pick": 16
  };
}

const tmdbService = new TMDBService();
export default tmdbService;
export { TMDBService };