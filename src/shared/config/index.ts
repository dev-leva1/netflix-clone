export const config = {
  api: {
    baseUrl: import.meta.env.DEV 
      ? '/api/v1.4'  // Используем proxy в development
      : import.meta.env.VITE_API_BASE_URL || 'https://api.kinopoisk.dev/v1.4',
    apiKey: import.meta.env.VITE_KINOPOISK_API_KEY || '',
    timeout: 10000,
  },
  app: {
    name: 'Netflix Clone',
    version: '1.0.0',
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
  ui: {
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
    colors: {
      primary: '#E50914',
      secondary: '#221F1F',
      background: '#000000',
      surface: '#141414',
      text: {
        primary: '#FFFFFF',
        secondary: '#B3B3B3',
        muted: '#808080',
      },
      error: '#F40612',
      warning: '#FFA500',
      success: '#46D369',
      info: '#54B9C5',
    },
    transitions: {
      default: '0.3s ease',
      fast: '0.15s ease',
      slow: '0.5s ease',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '50%',
    },
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
      large: '0 8px 16px rgba(0, 0, 0, 0.2)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.25)',
    },
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 250,
  },
  cache: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
  sentry: {
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  },
} as const

export type Config = typeof config

export default config 