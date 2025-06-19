import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { moviesApi, type MoviesQueryParams } from '@/shared/api/movies'
import { useAppStore } from '@/shared/lib/store'
import { config } from '@/shared/config'

// Query Keys
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (params: MoviesQueryParams) => [...movieKeys.lists(), params] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
  trending: () => [...movieKeys.all, 'trending'] as const,
  newReleases: () => [...movieKeys.all, 'newReleases'] as const,
  topRated: () => [...movieKeys.all, 'topRated'] as const,
  similar: (id: number) => [...movieKeys.all, 'similar', id] as const,
  seasons: (id: number) => [...movieKeys.all, 'seasons', id] as const,
  reviews: (id: number) => [...movieKeys.all, 'reviews', id] as const,
}

// Хук для получения списка фильмов
export const useMovies = (params: MoviesQueryParams = {}) => {
  const { setLoading, setError } = useAppStore()
  
  const query = useQuery({
    queryKey: movieKeys.list(params),
    queryFn: () => moviesApi.getMovies(params),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })

  // Используем useEffect для side effects вместо устаревших onSuccess/onError
  useEffect(() => {
    if (query.isSuccess) {
      setLoading('trending', 'success')
      setError('trending')
    } else if (query.isError) {
      setLoading('trending', 'error')
      setError('trending', query.error)
    }
  }, [query.isSuccess, query.isError, query.error, setLoading, setError])

  return query
}

// Хук для получения конкретного фильма
export const useMovie = (id: number, enabled = true) => {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => moviesApi.getMovie(id),
    enabled: enabled && Boolean(id),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для поиска фильмов
export const useSearchMovies = (query: string, params: MoviesQueryParams = {}) => {
  const { setLoading, setError } = useAppStore()
  
  const searchQuery = useQuery({
    queryKey: movieKeys.search(query),
    queryFn: () => moviesApi.searchMovies(query, params),
    enabled: Boolean(query.trim()),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })

  useEffect(() => {
    if (searchQuery.isSuccess) {
      setLoading('search', 'success')
      setError('search')
    } else if (searchQuery.isError) {
      setLoading('search', 'error')
      setError('search', searchQuery.error)
    }
  }, [searchQuery.isSuccess, searchQuery.isError, searchQuery.error, setLoading, setError])

  return searchQuery
}

// Хук для бесконечной прокрутки фильмов
export const useInfiniteMovies = (params: MoviesQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: movieKeys.list(params),
    queryFn: ({ pageParam }) => moviesApi.getMovies({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
    },
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для трендовых фильмов
export const useTrendingMovies = (params: MoviesQueryParams = {}) => {
  const { setTrendingMovies, setLoading, setError } = useAppStore()
  
  const query = useQuery({
    queryKey: movieKeys.trending(),
    queryFn: () => moviesApi.getTrendingMovies(params),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setTrendingMovies(query.data.docs)
      setLoading('trending', 'success')
      setError('trending')
    } else if (query.isError) {
      setLoading('trending', 'error')
      setError('trending', query.error)
    }
  }, [query.isSuccess, query.isError, query.data, query.error, setTrendingMovies, setLoading, setError])

  return query
}

// Хук для новых фильмов
export const useNewMovies = (params: MoviesQueryParams = {}) => {
  const { setNewReleases, setLoading, setError } = useAppStore()
  
  const query = useQuery({
    queryKey: movieKeys.newReleases(),
    queryFn: () => moviesApi.getNewMovies(params),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setNewReleases(query.data.docs)
      setLoading('newReleases', 'success')
      setError('newReleases')
    } else if (query.isError) {
      setLoading('newReleases', 'error')
      setError('newReleases', query.error)
    }
  }, [query.isSuccess, query.isError, query.data, query.error, setNewReleases, setLoading, setError])

  return query
}

// Хук для топ фильмов
export const useTopMovies = (params: MoviesQueryParams = {}) => {
  const { setTopRated, setLoading, setError } = useAppStore()
  
  const query = useQuery({
    queryKey: movieKeys.topRated(),
    queryFn: () => moviesApi.getTopMovies(params),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setTopRated(query.data.docs)
      setLoading('topRated', 'success')
      setError('topRated')
    } else if (query.isError) {
      setLoading('topRated', 'error')
      setError('topRated', query.error)
    }
  }, [query.isSuccess, query.isError, query.data, query.error, setTopRated, setLoading, setError])

  return query
}

// Хук для похожих фильмов
export const useSimilarMovies = (movieId: number, params: MoviesQueryParams = {}) => {
  return useQuery({
    queryKey: movieKeys.similar(movieId),
    queryFn: () => moviesApi.getSimilarMovies(movieId, params),
    enabled: Boolean(movieId),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для сезонов сериала
export const useMovieSeasons = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.seasons(movieId),
    queryFn: () => moviesApi.getMovieSeasons(movieId),
    enabled: Boolean(movieId),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для отзывов о фильме
export const useMovieReviews = (movieId: number, params = {}) => {
  return useQuery({
    queryKey: movieKeys.reviews(movieId),
    queryFn: () => moviesApi.getMovieReviews(movieId, params),
    enabled: Boolean(movieId),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для случайного фильма
export const useRandomMovie = (params?: MoviesQueryParams) => {
  return useQuery({
    queryKey: [...movieKeys.all, 'random', params],
    queryFn: () => moviesApi.getRandomMovie(params),
    staleTime: 0, // Всегда получать новый случайный фильм
    gcTime: config.cache.cacheTime,
  })
}

// Хук для предзагрузки фильма
export const usePrefetchMovie = () => {
  const queryClient = useQueryClient()
  
  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: movieKeys.detail(id),
      queryFn: () => moviesApi.getMovie(id),
      staleTime: config.cache.staleTime,
    })
  }
}

// Хук для инвалидации кэша
export const useInvalidateMovies = () => {
  const queryClient = useQueryClient()
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: movieKeys.all }),
    invalidateList: (params?: MoviesQueryParams) => 
      queryClient.invalidateQueries({ queryKey: params ? movieKeys.list(params) : movieKeys.lists() }),
    invalidateDetail: (id: number) => 
      queryClient.invalidateQueries({ queryKey: movieKeys.detail(id) }),
    invalidateSearch: (query: string) => 
      queryClient.invalidateQueries({ queryKey: movieKeys.search(query) }),
  }
}

// Типы для экспорта
export type UseMoviesResult = ReturnType<typeof useMovies>
export type UseMovieResult = ReturnType<typeof useMovie>
export type UseSearchMoviesResult = ReturnType<typeof useSearchMovies>
export type UseInfiniteMoviesResult = ReturnType<typeof useInfiniteMovies> 