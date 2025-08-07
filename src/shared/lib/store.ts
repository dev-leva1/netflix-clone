import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Movie, LoadingState, BaseError } from '@/shared/types'

interface AppState {
  // UI состояние
  theme: 'dark' | 'light'
  sidebarOpen: boolean
  searchQuery: string
  searchFilters: {
    genre?: string
    year?: number | string
    ratingFrom?: number
  }
  searchHistory: string[]
  
  // Фильмы состояние
  movies: {
    trending: Movie[]
    newReleases: Movie[]
    topRated: Movie[]
    favorites: Movie[]
  }
  
  // Загрузка и ошибки
  loading: {
    trending: LoadingState
    newReleases: LoadingState
    topRated: LoadingState
    favorites: LoadingState
    search: LoadingState
  }
  
  errors: {
    trending?: BaseError
    newReleases?: BaseError
    topRated?: BaseError
    favorites?: BaseError
    search?: BaseError
  }
  
  // Пользовательские настройки
  settings: {
    autoplay: boolean
    quality: 'auto' | 'low' | 'medium' | 'high'
    subtitles: boolean
    volume: number
  }
}

interface AppActions {
  // UI действия
  setTheme: (theme: AppState['theme']) => void
  toggleSidebar: () => void
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: Partial<AppState['searchFilters']>) => void
  clearSearchFilters: () => void
  addToSearchHistory: (q: string) => void
  clearSearchHistory: () => void
  
  // Фильмы действия
  setTrendingMovies: (movies: Movie[]) => void
  setNewReleases: (movies: Movie[]) => void
  setTopRated: (movies: Movie[]) => void
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (movieId: number) => void
  toggleFavorite: (movie: Movie) => void
  clearFavorites: () => void
  
  // Загрузка и ошибки
  setLoading: (key: keyof AppState['loading'], state: LoadingState) => void
  setError: (key: keyof AppState['errors'], error?: BaseError) => void
  clearError: (key: keyof AppState['errors']) => void
  clearAllErrors: () => void
  
  // Настройки
  updateSettings: (settings: Partial<AppState['settings']>) => void
  resetSettings: () => void
  
  // Сброс состояния
  reset: () => void
}

const initialState: AppState = {
  theme: 'dark',
  sidebarOpen: false,
  searchQuery: '',
  searchFilters: {},
  searchHistory: [],
  
  movies: {
    trending: [],
    newReleases: [],
    topRated: [],
    favorites: [],
  },
  
  loading: {
    trending: 'idle',
    newReleases: 'idle',
    topRated: 'idle',
    favorites: 'idle',
    search: 'idle',
  },
  
  errors: {},
  
  settings: {
    autoplay: true,
    quality: 'auto',
    subtitles: false,
    volume: 0.8,
  },
}

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        
        // UI действия
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme
          }),
        
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen
          }),
        
        setSearchQuery: (query) =>
          set((state) => {
            state.searchQuery = query
          }),
        
        setSearchFilters: (filters) =>
          set((state) => {
            state.searchFilters = { ...state.searchFilters, ...filters }
          }),

        clearSearchFilters: () =>
          set((state) => {
            state.searchFilters = {}
          }),

        addToSearchHistory: (q) =>
          set((state) => {
            const trimmed = q.trim()
            if (!trimmed) return
            const next = [
              trimmed,
              ...state.searchHistory.filter((s: string) => s !== trimmed),
            ].slice(0, 10)
            state.searchHistory = next
          }),

        clearSearchHistory: () =>
          set((state) => {
            state.searchHistory = []
          }),
        
        // Фильмы действия
        setTrendingMovies: (movies) =>
          set((state) => {
            state.movies.trending = movies
          }),
        
        setNewReleases: (movies) =>
          set((state) => {
            state.movies.newReleases = movies
          }),
        
        setTopRated: (movies) =>
          set((state) => {
            state.movies.topRated = movies
          }),
        
        addToFavorites: (movie) =>
          set((state) => {
            const exists = state.movies.favorites.some((fav: Movie) => fav.id === movie.id)
            if (!exists) {
              state.movies.favorites.push(movie)
            }
          }),
        
        removeFromFavorites: (movieId) =>
          set((state) => {
            state.movies.favorites = state.movies.favorites.filter(
              (movie: Movie) => movie.id !== movieId
            )
          }),
        
        toggleFavorite: (movie) =>
          set((state) => {
            const exists = state.movies.favorites.some((fav: Movie) => fav.id === movie.id)
            if (exists) {
              state.movies.favorites = state.movies.favorites.filter(
                (fav: Movie) => fav.id !== movie.id
              )
            } else {
              state.movies.favorites.push(movie)
            }
          }),
        
        clearFavorites: () =>
          set((state) => {
            state.movies.favorites = []
          }),
        
        // Загрузка и ошибки
        setLoading: (key, loadingState) =>
          set((state) => {
            state.loading[key] = loadingState
          }),
        
        setError: (key, error) =>
          set((state) => {
            if (error) {
              state.errors[key] = error
            } else {
              delete state.errors[key]
            }
          }),
        
        clearError: (key) =>
          set((state) => {
            delete state.errors[key]
          }),
        
        clearAllErrors: () =>
          set((state) => {
            state.errors = {}
          }),
        
        // Настройки
        updateSettings: (newSettings) =>
          set((state) => {
            Object.assign(state.settings, newSettings)
          }),
        
        resetSettings: () =>
          set((state) => {
            state.settings = initialState.settings
          }),
        
        // Сброс состояния
        reset: () => set(initialState),
      })),
      {
        name: 'netflix-clone-storage',
        partialize: (state) => ({
          theme: state.theme,
          settings: state.settings,
          movies: {
            favorites: state.movies.favorites,
          },
          searchHistory: state.searchHistory,
        }),
      }
    ),
    {
      name: 'netflix-clone-store',
    }
  )
)

// Селекторы для оптимизации рендеринга
export const useTheme = () => useAppStore(state => state.theme)
export const useSidebarOpen = () => useAppStore(state => state.sidebarOpen)
export const useSearchQuery = () => useAppStore(state => state.searchQuery)
export const useFavorites = () => useAppStore(state => state.movies.favorites)
export const useSettings = () => useAppStore(state => state.settings)
export const useLoading = () => useAppStore(state => state.loading)
export const useErrors = () => useAppStore(state => state.errors)

// Хелперы
export const useIsFavorite = (movieId: number) => 
  useAppStore(state => state.movies.favorites.some(movie => movie.id === movieId))

export const useIsLoading = (key: keyof AppState['loading']) =>
  useAppStore(state => state.loading[key] === 'loading')

export const useHasError = (key: keyof AppState['errors']) =>
  useAppStore(state => Boolean(state.errors[key]))

export type AppStore = typeof useAppStore 