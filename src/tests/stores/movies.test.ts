import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMoviesStore } from '../../stores/movies'
import tmdbApi from '../../services/tmdbApi'
import type { Movie, TMDBResponse } from '../../types'

// Mock the tmdb service
vi.mock('../../services/tmdbApi', () => ({
  default: {
    getPopularMovies: vi.fn(),
    getNowPlayingMovies: vi.fn(),
    searchMovies: vi.fn(),
    getMoviesByGenre: vi.fn(),
    getMovieVideos: vi.fn(),
    getImageUrl: vi.fn(),
    getTrailerKey: vi.fn()
  },
  TMDBService: {
    genreMap: {
      'Action': 28,
      'Comedy': 35,
      'Horror': 27,
      'Romance': 10749,
      'Science Fiction': 878,
      "Editor's Pick": 16
    }
  }
}))

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

describe('Movies Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const moviesStore = useMoviesStore()
    
    expect(moviesStore.popularMovies).toEqual([])
    expect(moviesStore.nowPlayingMovies).toEqual([])
    expect(moviesStore.genreMovies).toEqual([])
    expect(moviesStore.searchResults).toEqual([])
    expect(moviesStore.featuredMovie).toBe(null)
    expect(moviesStore.loading).toBe(false)
    expect(moviesStore.error).toBe(null)
  })

  it('should have correct getters', () => {
    const moviesStore = useMoviesStore()
    
    expect(moviesStore.isLoading).toBe(false)
    expect(moviesStore.hasError).toBe(false)
    expect(moviesStore.hasMovies).toBe(false)
    expect(moviesStore.hasPopularMovies).toBe(false)
    expect(moviesStore.isSearching).toBe(false)
  })

  it('should set loading state', () => {
    const moviesStore = useMoviesStore()
    
    moviesStore.setLoading(true)
    expect(moviesStore.loading).toBe(true)
    expect(moviesStore.isLoading).toBe(true)
  })

  it('should set error state', () => {
    const moviesStore = useMoviesStore()
    
    moviesStore.setError('Test error')
    expect(moviesStore.error).toBe('Test error')
    expect(moviesStore.hasError).toBe(true)
    
    moviesStore.clearError()
    expect(moviesStore.error).toBe(null)
    expect(moviesStore.hasError).toBe(false)
  })

  it('should fetch popular movies', async () => {
    const moviesStore = useMoviesStore()
    
    vi.mocked(tmdbApi.getPopularMovies).mockResolvedValue(mockTMDBResponse)
    
    const result = await moviesStore.fetchPopularMovies()
    
    expect(tmdbApi.getPopularMovies).toHaveBeenCalledWith(1)
    expect(moviesStore.popularMovies).toEqual([mockMovie])
    expect(moviesStore.featuredMovie).toEqual(mockMovie)
    expect(result).toEqual([mockMovie])
  })

  it('should handle fetch popular movies error', async () => {
    const moviesStore = useMoviesStore()
    const errorMessage = 'API Error'
    
    vi.mocked(tmdbApi.getPopularMovies).mockRejectedValue(new Error(errorMessage))
    
    await expect(moviesStore.fetchPopularMovies()).rejects.toThrow(errorMessage)
    expect(moviesStore.error).toBe(errorMessage)
  })

  it('should fetch now playing movies', async () => {
    const moviesStore = useMoviesStore()
    
    vi.mocked(tmdbApi.getNowPlayingMovies).mockResolvedValue(mockTMDBResponse)
    
    const result = await moviesStore.fetchNowPlayingMovies()
    
    expect(tmdbApi.getNowPlayingMovies).toHaveBeenCalledWith(1)
    expect(moviesStore.nowPlayingMovies).toEqual([mockMovie])
    expect(result).toEqual([mockMovie])
  })

  it('should search movies', async () => {
    const moviesStore = useMoviesStore()
    const query = 'test query'
    
    vi.mocked(tmdbApi.searchMovies).mockResolvedValue(mockTMDBResponse)
    
    const result = await moviesStore.searchMovies(query)
    
    expect(tmdbApi.searchMovies).toHaveBeenCalledWith(query, 1)
    expect(moviesStore.searchResults).toEqual([mockMovie])
    expect(moviesStore.searchQuery).toBe(query)
    expect(result).toEqual([mockMovie])
  })

  it('should clear search results for empty query', async () => {
    const moviesStore = useMoviesStore()
    
    const result = await moviesStore.searchMovies('')
    
    expect(moviesStore.searchResults).toEqual([])
    expect(moviesStore.searchQuery).toBe('')
    expect(result).toEqual([])
    expect(tmdbApi.searchMovies).not.toHaveBeenCalled()
  })

  it('should fetch movies by genre', async () => {
    const moviesStore = useMoviesStore()
    const genre = 'Action'
    
    vi.mocked(tmdbApi.getMoviesByGenre).mockResolvedValue(mockTMDBResponse)
    
    const result = await moviesStore.fetchMoviesByGenre(genre)
    
    expect(tmdbApi.getMoviesByGenre).toHaveBeenCalledWith(28) // Action genre ID
    expect(moviesStore.genreMovies).toEqual([mockMovie])
    expect(moviesStore.selectedGenre).toBe(genre)
    expect(result).toEqual([mockMovie])
  })

  it('should check cache validity', () => {
    const moviesStore = useMoviesStore()
    
    // Cache should be invalid initially
    expect(moviesStore.isCacheValid('popular')).toBe(false)
    
    // Update cache time
    moviesStore.updateCacheTime('popular')
    expect(moviesStore.isCacheValid('popular')).toBe(true)
  })

  it('should get movie image URL', () => {
    const moviesStore = useMoviesStore()
    const mockUrl = 'https://image.tmdb.org/t/p/w500/test.jpg'
    
    vi.mocked(tmdbApi.getImageUrl).mockReturnValue(mockUrl)
    
    const result = moviesStore.getMovieImageUrl('/test.jpg')
    
    expect(tmdbApi.getImageUrl).toHaveBeenCalledWith('/test.jpg', 'w500')
    expect(result).toBe(mockUrl)
  })

  it('should initialize data', async () => {
    const moviesStore = useMoviesStore()
    
    vi.mocked(tmdbApi.getPopularMovies).mockResolvedValue(mockTMDBResponse)
    vi.mocked(tmdbApi.getNowPlayingMovies).mockResolvedValue(mockTMDBResponse)
    
    await moviesStore.initializeData()
    
    expect(tmdbApi.getPopularMovies).toHaveBeenCalledWith(1)
    expect(tmdbApi.getNowPlayingMovies).toHaveBeenCalledWith(1)
  })

  it('should clear search results', () => {
    const moviesStore = useMoviesStore()
    
    // Set some search data
    moviesStore.searchResults = [mockMovie]
    moviesStore.setSearchQuery('test')
    
    moviesStore.clearSearchResults()
    
    expect(moviesStore.searchResults).toEqual([])
    expect(moviesStore.searchQuery).toBe('')
  })

  it('should reset store state', () => {
    const moviesStore = useMoviesStore()
    
    // Set some state
    moviesStore.popularMovies = [mockMovie]
    moviesStore.setError('Some error')
    moviesStore.setLoading(true)
    
    // Reset
    moviesStore.$reset()
    
    expect(moviesStore.popularMovies).toEqual([])
    expect(moviesStore.error).toBe(null)
    expect(moviesStore.loading).toBe(false)
  })
})