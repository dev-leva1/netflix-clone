export interface Movie {
  id: number
  name: string
  alternativeName?: string
  enName?: string
  names?: Array<{
    name: string
    language?: string
    type?: string
  }>
  description?: string
  shortDescription?: string
  year?: number
  rating?: {
    kp?: number
    imdb?: number
    filmCritics?: number
    russianFilmCritics?: number
    await?: number
  }
  votes?: {
    kp?: number
    imdb?: number
    filmCritics?: number
    russianFilmCritics?: number
    await?: number
  }
  movieLength?: number
  totalSeriesLength?: number
  seriesLength?: number
  ratingMpaa?: string
  ageRating?: number
  poster?: {
    url?: string
    previewUrl?: string
  }
  backdrop?: {
    url?: string
    previewUrl?: string
  }
  genres?: Array<{
    name: string
  }>
  countries?: Array<{
    name: string
  }>
  persons?: Array<{
    id: number
    photo?: string
    name?: string
    enName?: string
    description?: string
    profession?: string
    enProfession?: string
  }>
  facts?: Array<{
    value: string
    type?: string
    spoiler?: boolean
  }>
  seasonsInfo?: Array<{
    number: number
    episodesCount: number
  }>
  videos?: {
    trailers?: Array<{
      url: string
      name?: string
      site?: string
      type?: string
    }>
    teasers?: Array<{
      url: string
      name?: string
      site?: string
      type?: string
    }>
  }
  status?: string
  type?: 'movie' | 'tv-series' | 'cartoon' | 'anime' | 'animated-series'
  typeNumber?: number
  isSeries?: boolean
  releaseYears?: Array<{
    start?: number
    end?: number
  }>
  premiere?: {
    world?: string
    russia?: string
    digital?: string
    cinema?: string
    bluray?: string
    dvd?: string
  }
  slogan?: string
  budget?: {
    value?: number
    currency?: string
  }
  fees?: {
    world?: {
      value?: number
      currency?: string
    }
    russia?: {
      value?: number
      currency?: string
    }
    usa?: {
      value?: number
      currency?: string
    }
  }
  technology?: {
    hasImax?: boolean
    has3D?: boolean
  }
  watchability?: {
    items?: Array<{
      name: string
      logo?: {
        url?: string
      }
      url?: string
    }>
  }
  lists?: string[]
  networks?: Array<{
    name: string
    logo?: {
      url?: string
    }
  }>
  updatedAt?: string
  createdAt?: string
}

export interface ApiResponse<T> {
  docs: T[]
  total: number
  limit: number
  page: number
  pages: number
}

export interface Person {
  id: number
  name?: string
  enName?: string
  photo?: string
  sex?: string
  growth?: number
  birthday?: string
  death?: string
  age?: number
  birthPlace?: Array<{
    value: string
  }>
  deathPlace?: Array<{
    value: string
  }>
  profession?: Array<{
    value: string
  }>
  facts?: Array<{
    value: string
  }>
  movies?: Array<{
    id: number
    name?: string
    alternativeName?: string
    rating?: number
    general?: boolean
    description?: string
    enProfession?: string
  }>
  updatedAt?: string
  createdAt?: string
}

export interface Genre {
  name: string
  slug: string
}

export interface Country {
  name: string
  slug: string
}

export interface Review {
  id: number
  movieId: number
  title?: string
  type: 'Позитивный' | 'Негативный' | 'Нейтральный'
  review: string
  date: string
  author?: string
  userRating?: number
  authorId?: number
  updatedAt?: string
  createdAt?: string
}

export interface Season {
  movieId: number
  number: number
  episodesCount: number
  episodes?: Array<{
    number: number
    name?: string
    enName?: string
    description?: string
    still?: {
      url?: string
      previewUrl?: string
    }
    airDate?: string
    enAirDate?: string
  }>
  poster?: {
    url?: string
    previewUrl?: string
  }
  name?: string
  enName?: string
  description?: string
  enDescription?: string
  airDate?: string
  enAirDate?: string
  updatedAt?: string
  createdAt?: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface BaseError {
  message: string
  code?: string | number
  status?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SortParams {
  field?: string
  sortType?: 1 | -1
}

export interface FilterParams extends Record<string, unknown> {
  'genres.name'?: string | string[]
  'countries.name'?: string | string[]
  'year'?: string | number
  'rating.kp'?: string
  'rating.imdb'?: string
  'ageRating'?: string | number
  'type'?: Movie['type']
  'status'?: string
  'networks.name'?: string
  'persons.profession'?: string
  'persons.id'?: string | number
}

// Типы для темы Emotion
export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    muted: string
  }
  error: string
  warning: string
  success: string
  info: string
}

export interface ThemeBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

export interface ThemeTransitions {
  default: string
  fast: string
  slow: string
}

export interface ThemeBorderRadius {
  small: string
  medium: string
  large: string
  round: string
}

export interface ThemeShadows {
  small: string
  medium: string
  large: string
  xl: string
}

export interface AppTheme {
  colors: ThemeColors
  breakpoints: ThemeBreakpoints
  transitions: ThemeTransitions
  borderRadius: ThemeBorderRadius
  shadows: ThemeShadows
} 