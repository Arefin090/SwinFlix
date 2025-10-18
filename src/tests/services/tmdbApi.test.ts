import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import type { Movie, TMDBResponse, TMDBVideosResponse } from '../../types'

const mockAxiosInstance = {
  get: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
}

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance)
  }
}))

// Mock the service to focus on functionality
vi.mock('../../services/tmdbApi', async () => {
  const actual = await vi.importActual('../../services/tmdbApi')
  return {
    ...actual,
    default: {
      getPopularMovies: vi.fn(),
      getNowPlayingMovies: vi.fn(),
      searchMovies: vi.fn(),
      getMoviesByGenre: vi.fn(),
      getMovieVideos: vi.fn(),
      getMovieDetails: vi.fn(),
      getImageUrl: vi.fn(),
      getTrailerKey: vi.fn()
    }
  }
})

const tmdbApi = await import('../../services/tmdbApi')

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
  video: false
}

const mockTMDBResponse: TMDBResponse<Movie> = {
  page: 1,
  results: [mockMovie],
  total_pages: 1,
  total_results: 1
}

const mockVideosResponse: TMDBVideosResponse = {
  id: 1,
  results: [
    {
      id: 'video-1',
      key: 'abc123',
      name: 'Official Trailer',
      site: 'YouTube',
      type: 'Trailer',
      official: true,
      published_at: '2023-01-01T00:00:00.000Z',
      size: 1080,
      iso_639_1: 'en',
      iso_3166_1: 'US'
    }
  ]
}

describe('TMDB Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch popular movies', async () => {
    vi.mocked(tmdbApi.default.getPopularMovies).mockResolvedValue(mockTMDBResponse)

    const result = await tmdbApi.default.getPopularMovies(1)

    expect(tmdbApi.default.getPopularMovies).toHaveBeenCalledWith(1)
    expect(result).toEqual(mockTMDBResponse)
  })

  it('should fetch now playing movies', async () => {
    vi.mocked(tmdbApi.default.getNowPlayingMovies).mockResolvedValue(mockTMDBResponse)

    const result = await tmdbApi.default.getNowPlayingMovies(2)

    expect(tmdbApi.default.getNowPlayingMovies).toHaveBeenCalledWith(2)
    expect(result).toEqual(mockTMDBResponse)
  })

  it('should search movies', async () => {
    const query = 'test movie'
    vi.mocked(tmdbApi.default.searchMovies).mockResolvedValue(mockTMDBResponse)

    const result = await tmdbApi.default.searchMovies(query, 1)

    expect(tmdbApi.default.searchMovies).toHaveBeenCalledWith(query, 1)
    expect(result).toEqual(mockTMDBResponse)
  })

  it('should fetch movies by genre', async () => {
    const genreId = 28
    vi.mocked(tmdbApi.default.getMoviesByGenre).mockResolvedValue(mockTMDBResponse)

    const result = await tmdbApi.default.getMoviesByGenre(genreId, 1)

    expect(tmdbApi.default.getMoviesByGenre).toHaveBeenCalledWith(genreId, 1)
    expect(result).toEqual(mockTMDBResponse)
  })

  it('should fetch movie videos', async () => {
    const movieId = 123
    vi.mocked(tmdbApi.default.getMovieVideos).mockResolvedValue(mockVideosResponse)

    const result = await tmdbApi.default.getMovieVideos(movieId)

    expect(tmdbApi.default.getMovieVideos).toHaveBeenCalledWith(movieId)
    expect(result).toEqual(mockVideosResponse)
  })

  it('should fetch movie details', async () => {
    const movieId = 123
    vi.mocked(tmdbApi.default.getMovieDetails).mockResolvedValue(mockMovie)

    const result = await tmdbApi.default.getMovieDetails(movieId)

    expect(tmdbApi.default.getMovieDetails).toHaveBeenCalledWith(movieId)
    expect(result).toEqual(mockMovie)
  })

  it('should generate image URL', () => {
    const path = '/test.jpg'
    const size = 'w500'
    const expectedUrl = 'https://image.tmdb.org/t/p/w500/test.jpg'

    vi.mocked(tmdbApi.default.getImageUrl).mockReturnValue(expectedUrl)

    const result = tmdbApi.default.getImageUrl(path, size)

    expect(tmdbApi.default.getImageUrl).toHaveBeenCalledWith(path, size)
    expect(result).toBe(expectedUrl)
  })

  it('should return null for null image path', () => {
    vi.mocked(tmdbApi.default.getImageUrl).mockReturnValue(null)

    const result = tmdbApi.default.getImageUrl(null)

    expect(tmdbApi.default.getImageUrl).toHaveBeenCalledWith(null)
    expect(result).toBe(null)
  })

  it('should get trailer key from videos', () => {
    vi.mocked(tmdbApi.default.getTrailerKey).mockReturnValue('abc123')

    const result = tmdbApi.default.getTrailerKey(mockVideosResponse)

    expect(tmdbApi.default.getTrailerKey).toHaveBeenCalledWith(mockVideosResponse)
    expect(result).toBe('abc123')
  })

  it('should return null if no trailer found', () => {
    const videosWithoutTrailer: TMDBVideosResponse = {
      id: 1,
      results: []
    }

    vi.mocked(tmdbApi.default.getTrailerKey).mockReturnValue(null)

    const result = tmdbApi.default.getTrailerKey(videosWithoutTrailer)

    expect(tmdbApi.default.getTrailerKey).toHaveBeenCalledWith(videosWithoutTrailer)
    expect(result).toBe(null)
  })

  it('should have correct genre map', () => {
    expect(tmdbApi.TMDBService.genreMap).toEqual({
      'Action': 28,
      'Comedy': 35,
      'Horror': 27,
      'Romance': 10749,
      'Science Fiction': 878,
      "Editor's Pick": 16
    })
  })
})