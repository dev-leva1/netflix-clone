import { apiClient, createRequestConfig } from './client'
import { getMockTrendingMovies, getMockNewMovies, getMockTopMovies } from './mockData'
import type { 
  Movie, 
  ApiResponse, 
  PaginationParams, 
  SortParams, 
  FilterParams,
  Review,
  Season
} from '@/shared/types'

export interface MoviesQueryParams extends PaginationParams, SortParams, FilterParams {
  selectFields?: string[]
  notNullFields?: string[]
  search?: string
  suggestions?: boolean
}

export const moviesApi = {
  async getMovies(params: MoviesQueryParams = {}): Promise<ApiResponse<Movie>> {
    try {
      const response = await apiClient.get<ApiResponse<Movie>>('/movie', createRequestConfig(params))
      return response.data
    } catch (error) {
      console.warn('API request failed, using mock data:', error)
      return getMockTrendingMovies()
    }
  },

  async getMovie(id: number, params?: { selectFields?: string[] }): Promise<Movie> {
    try {
      const defaultSelectFields: string[] = [
        'id',
        'name',
        'alternativeName',
        'year',
        'rating.kp',
        'votes.kp',
        'poster.url',
        'poster.previewUrl',
        'backdrop.url',
        'backdrop.previewUrl',
        'genres.name',
        'countries.name',
        'movieLength',
        'shortDescription',
        'description',
        'slogan',
        'ageRating',
        'videos.trailers.url',
        'videos.trailers.name',
        'videos.trailers.site',
        'watchability.items.name',
        'watchability.items.url',
        'persons.id',
        'persons.name',
        'persons.enName',
        'persons.photo',
        'persons.enProfession',
      ]

      const response = await apiClient.get<Movie>(
        `/movie/${id}`,
        createRequestConfig({ selectFields: params?.selectFields ?? defaultSelectFields })
      )
      return response.data
    } catch (error) {
      console.warn('API request failed, using mock data:', error)
      const mockData = getMockTrendingMovies()
      return (mockData.docs.find((m) => m.id === id) || mockData.docs[0] || {}) as Movie
    }
  },

  async searchMovies(query: string, params: Omit<MoviesQueryParams, 'search'> = {}): Promise<ApiResponse<Movie>> {
    try {
      const searchParams = {
        ...params,
        search: query,
      }
      const response = await apiClient.get<ApiResponse<Movie>>('/movie/search', createRequestConfig(searchParams))
      return response.data
    } catch (error) {
      console.warn('Search API request failed, using mock data:', error)
      return getMockTrendingMovies()
    }
  },

  async suggestMovies(query: string): Promise<Pick<ApiResponse<Movie>, 'docs'>> {
    try {
      const params = { search: query, selectFields: ['id', 'name', 'year'], limit: 8, suggestions: true }
      const response = await apiClient.get<ApiResponse<Movie>>('/movie/search', createRequestConfig(params))
      return { docs: response.data.docs }
    } catch {
      const mock = await this.searchMovies(query)
      return { docs: mock.docs.slice(0, 8) }
    }
  },

  async getRandomMovie(params?: FilterParams): Promise<Movie> {
    try {
      const response = await apiClient.get<Movie>('/movie/random', createRequestConfig(params))
      return response.data
    } catch (error) {
      console.warn('Random movie API request failed, using mock data:', error)
      const mockData = getMockTrendingMovies()
      return mockData.docs[Math.floor(Math.random() * mockData.docs.length)] || {} as Movie
    }
  },

  async getMoviesByGenre(genre: string, params: Omit<MoviesQueryParams, 'genres.name'> = {}): Promise<ApiResponse<Movie>> {
    const genreParams = {
      ...params,
      'genres.name': genre,
    }
    return this.getMovies(genreParams)
  },

  async getMoviesByCountry(country: string, params: Omit<MoviesQueryParams, 'countries.name'> = {}): Promise<ApiResponse<Movie>> {
    const countryParams = {
      ...params,
      'countries.name': country,
    }
    return this.getMovies(countryParams)
  },

  async getMoviesByYear(year: number, params: Omit<MoviesQueryParams, 'year'> = {}): Promise<ApiResponse<Movie>> {
    const yearParams = {
      ...params,
      year,
    }
    return this.getMovies(yearParams)
  },

  async getMoviesByRating(minRating: number, params: MoviesQueryParams = {}): Promise<ApiResponse<Movie>> {
    const ratingParams = {
      ...params,
      'rating.kp': `${minRating}-10`,
    }
    return this.getMovies(ratingParams)
  },

  async getTrendingMovies(params: MoviesQueryParams = {}): Promise<ApiResponse<Movie>> {
    try {
      const trendingParams = {
        ...params,
        'rating.kp': '7-10',
        'votes.kp': '10000-999999',
        sortField: 'rating.kp',
        sortType: -1 as const,
        limit: 20,
      }
      const response = await apiClient.get<ApiResponse<Movie>>('/movie', createRequestConfig(trendingParams))
      return response.data
    } catch (error) {
      console.warn('Trending movies API request failed, using mock data:', error)
      return getMockTrendingMovies()
    }
  },

  async getNewMovies(params: MoviesQueryParams = {}): Promise<ApiResponse<Movie>> {
    try {
      const currentYear = new Date().getFullYear()
      const newParams = {
        ...params,
        year: `${currentYear - 1}-${currentYear}`,
        sortField: 'year',
        sortType: -1 as const,
        limit: 20,
      }
      const response = await apiClient.get<ApiResponse<Movie>>('/movie', createRequestConfig(newParams))
      return response.data
    } catch (error) {
      console.warn('New movies API request failed, using mock data:', error)
      return getMockNewMovies()
    }
  },

  async getTopMovies(params: MoviesQueryParams = {}): Promise<ApiResponse<Movie>> {
    try {
      const topParams = {
        ...params,
        'rating.kp': '8-10',
        'votes.kp': '50000-999999',
        sortField: 'rating.kp',
        sortType: -1 as const,
        limit: 20,
      }
      const response = await apiClient.get<ApiResponse<Movie>>('/movie', createRequestConfig(topParams))
      return response.data
    } catch (error) {
      console.warn('Top movies API request failed, using mock data:', error)
      return getMockTopMovies()
    }
  },

  async getSimilarMovies(movieId: number, params: MoviesQueryParams = {}): Promise<ApiResponse<Movie>> {
    try {
      const response = await apiClient.get<ApiResponse<Movie>>(`/movie/${movieId}/similars`, createRequestConfig(params))
      const data = response.data as unknown
      if (!data || typeof data !== 'object' || !('docs' in (data as any))) {
        throw new Error('Invalid similar movies response shape')
      }
      return data as ApiResponse<Movie>
    } catch (error) {
      console.warn('Similar movies API request failed, using mock data:', error)
      return getMockTrendingMovies()
    }
  },

  async getMovieSeasons(movieId: number): Promise<Season[]> {
    try {
      const response = await apiClient.get<Season[]>(`/season`, createRequestConfig({ movieId }))
      return response.data
    } catch (error) {
      console.warn('Movie seasons API request failed:', error)
      return []
    }
  },

  async getMovieReviews(movieId: number, params: PaginationParams = {}): Promise<ApiResponse<Review>> {
    try {
      const response = await apiClient.get<ApiResponse<Review>>(`/review`, createRequestConfig({ movieId, ...params }))
      return response.data
    } catch (error) {
      console.warn('Movie reviews API request failed:', error)
      return {
        docs: [],
        total: 0,
        limit: params.limit || 20,
        page: params.page || 1,
        pages: 0
      }
    }
  },
}

export type MoviesApi = typeof moviesApi 