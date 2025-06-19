export const APP_NAME = 'Netflix Clone'

export const ROUTES = {
  HOME: '/',
  MOVIE: '/movie/:id',
  SEARCH: '/search',
  FAVORITES: '/favorites',
} as const

export const API_ENDPOINTS = {
  MOVIES: '/movie',
  MOVIE_DETAIL: '/movie/:id',
  SEARCH: '/movie/search',
  RANDOM: '/movie/random',
  SEASONS: '/season',
  REVIEWS: '/review',
} as const

export const MOVIE_TYPES = {
  MOVIE: 'movie',
  TV_SERIES: 'tv-series',
  CARTOON: 'cartoon',
  ANIME: 'anime',
  ANIMATED_SERIES: 'animated-series',
} as const

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

export const DEFAULT_POSTER = '/placeholder-poster.jpg'
export const DEFAULT_BACKDROP = '/placeholder-backdrop.jpg' 