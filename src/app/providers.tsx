import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { Global, css } from '@emotion/react'
import { config } from '@/shared/config'
import { logger } from '@/shared/lib/logger'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { Fallback } from '@/app/Fallback'
import { DevToasts } from '@/app/DevToasts'
import { useEffect, useMemo } from 'react'
import { useTheme as useThemeStore } from '@/shared/lib/store'
import * as Sentry from '@sentry/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.cache.staleTime,
      gcTime: config.cache.cacheTime,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** (attempt - 1), 3000),
      refetchOnWindowFocus: false,
    },
  },
})

const createTheme = (mode: 'dark' | 'light') => {
  const darkColors = config.ui.colors
  const lightColors = {
    ...config.ui.colors,
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#111111',
      secondary: '#444444',
      muted: '#6B7280',
    },
  }
  const colors = mode === 'dark' ? darkColors : lightColors
  return {
    colors,
    breakpoints: config.ui.breakpoints,
    transitions: config.ui.transitions,
    borderRadius: config.ui.borderRadius,
    shadows: config.ui.shadows,
  }
}

const globalStyles = (theme: ReturnType<typeof createTheme>) => css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    line-height: 1.6;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Focus styles for accessibility */
  :focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.text.muted};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.secondary};
  }
`

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  const mode = useThemeStore()
  const currentTheme = useMemo(() => createTheme(mode), [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  useEffect(() => {
    if (config.sentry.dsn) {
      Sentry.init({
        dsn: config.sentry.dsn,
        environment: config.sentry.environment,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        tracesSampleRate: 0.2,
        replaysSessionSampleRate: 0.05,
        replaysOnErrorSampleRate: 1.0,
      })
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={currentTheme}>
          <Global styles={globalStyles(currentTheme)} />
          <ServiceWorkerRegister />
          <ErrorBoundary
            fallback={<Fallback />}
            onError={(error) => logger.error('Unhandled UI error', error)}
          >
            {children}
          </ErrorBoundary>
          {import.meta.env.DEV && <DevToasts />}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
} 

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {})
    }
  }, [])
  return null
}