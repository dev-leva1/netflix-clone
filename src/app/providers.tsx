import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { Global, css } from '@emotion/react'
import { config } from '@/shared/config'
//import { useAppStore } from '@/shared/lib/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.cache.staleTime,
      gcTime: config.cache.cacheTime,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: ${config.ui.colors.background};
    color: ${config.ui.colors.text.primary};
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

  img {
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${config.ui.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${config.ui.colors.text.muted};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${config.ui.colors.text.secondary};
  }
`

const theme = {
  colors: config.ui.colors,
  breakpoints: config.ui.breakpoints,
  transitions: config.ui.transitions,
  borderRadius: config.ui.borderRadius,
  shadows: config.ui.shadows,
}

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Global styles={globalStyles} />
          {children}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
} 