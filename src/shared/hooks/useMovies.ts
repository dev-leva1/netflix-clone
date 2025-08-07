import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { moviesApi, type MoviesQueryParams } from '@/shared/api/movies'
import { useDebouncedValue } from './useDebouncedValue'
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
  similar: (id: number, params?: MoviesQueryParams) => [...movieKeys.all, 'similar', id, params] as const,
  seasons: (id: number) => [...movieKeys.all, 'seasons', id] as const,
  reviews: (id: number) => [...movieKeys.all, 'reviews', id] as const,
}

// Хук для получения списка фильмов
export const useMovies = (params: MoviesQueryParams = {}) => {
  const { setLoading, setError } = useAppStore()

  const infinite = useInfiniteQuery({
    queryKey: movieKeys.list(params),
    queryFn: ({ pageParam }) => moviesApi.getMovies({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !('docs' in lastPage)) return undefined
      if (lastPage.docs.length === 0) return undefined
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
    },
    retry: (failureCount) => {
      if (failureCount >= 3) return false
      return true
    },
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })

  useEffect(() => {
    if (infinite.isSuccess) {
      setLoading('trending', 'success')
      setError('trending')
    } else if (infinite.isError) {
      setLoading('trending', 'error')
      setError('trending', infinite.error)
    }
  }, [infinite.isSuccess, infinite.isError, infinite.error, setLoading, setError])

  return infinite
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
  const debounced = useDebouncedValue(query, 400)

  const searchQuery = useQuery({
    queryKey: movieKeys.search(debounced),
    queryFn: () => moviesApi.searchMovies(debounced, params),
    enabled: Boolean(debounced.trim()),
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

// Хук для подсказок по поиску
export const useSearchSuggestions = (query: string) => {
  const debounced = useDebouncedValue(query, 250)
  return useQuery({
    queryKey: [...movieKeys.all, 'suggestions', debounced],
    queryFn: () => moviesApi.suggestMovies(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 60_000,
  })
}

// Хук для бесконечной прокрутки фильмов
export const useInfiniteMovies = (params: MoviesQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: movieKeys.list(params),
    queryFn: ({ pageParam }) => moviesApi.getMovies({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !('docs' in lastPage)) return undefined
      if (lastPage.docs.length === 0) return undefined
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
    },
    retry: (failureCount) => {
      if (failureCount >= 3) return false
      return true
    },
    refetchOnWindowFocus: false,
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для бесконечного поиска
export const useInfiniteSearchMovies = (query: string, params: MoviesQueryParams = {}) => {
  const debounced = useDebouncedValue(query, 400)
  return useInfiniteQuery({
    queryKey: [...movieKeys.all, 'search', 'infinite', debounced, params],
    queryFn: ({ pageParam }) => moviesApi.searchMovies(debounced, { ...params, page: pageParam }),
    initialPageParam: 1,
    enabled: Boolean(debounced.trim()),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !('docs' in lastPage)) return undefined
      if (lastPage.docs.length === 0) return undefined
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
    },
    refetchOnWindowFocus: false,
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для трендовых фильмов
export const useTrendingMovies = (params: MoviesQueryParams = {}) => {
  const { setTrendingMovies, setLoading, setError } = useAppStore()
  const queryClient = useQueryClient()
  
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
      // Warmup: prefetch top/new lists quietly
      queryClient.prefetchQuery({ queryKey: movieKeys.newReleases(), queryFn: () => moviesApi.getNewMovies({}) })
      queryClient.prefetchQuery({ queryKey: movieKeys.topRated(), queryFn: () => moviesApi.getTopMovies({}) })
    } else if (query.isError) {
      setLoading('trending', 'error')
      setError('trending', query.error)
    }
  }, [query.isSuccess, query.isError, query.data, query.error, setTrendingMovies, setLoading, setError, queryClient])

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
    queryKey: movieKeys.similar(movieId, params),
    queryFn: () => moviesApi.getSimilarMovies(movieId, params),
    enabled: Boolean(movieId),
    staleTime: config.cache.staleTime,
    gcTime: config.cache.cacheTime,
  })
}

// Хук для бесконечного списка похожих фильмов
export const useInfiniteSimilarMovies = (movieId: number, params: MoviesQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: movieKeys.similar(movieId, params),
    queryFn: ({ pageParam }) => moviesApi.getSimilarMovies(movieId, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
    },
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
export type UseInfiniteSearchMoviesResult = ReturnType<typeof useInfiniteSearchMovies>
