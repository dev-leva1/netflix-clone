// no React import needed
import { render, screen } from '@testing-library/react'
import { Providers } from '@/app/providers'
import { SearchPage } from './SearchPage'
import { vi, describe, it, beforeEach, expect, type Mock } from 'vitest'
import { useAppStore } from '@/shared/lib/store'

const useSearchParamsMock = vi.fn(() => new URLSearchParams({}))
useSearchParamsMock.mockReturnValue(new URLSearchParams({}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useSearchParams: () => [useSearchParamsMock()],
  }
})

vi.mock('@/shared/hooks/useIntersectionObserver', () => {
  return {
    useIntersectionObserver: (onIntersect: () => void) => {
      // Сразу триггерим пересечение для проверки fetchNextPage
      setTimeout(() => onIntersect(), 0)
      return { targetRef: { current: null } }
    },
  }
})

vi.mock('@/shared/hooks/useMovies', () => {
  const useSearchMovies = vi.fn().mockReturnValue({
    data: { docs: [], total: 0, page: 1, pages: 1 },
    isLoading: false,
    error: undefined,
  })
  const fetchNextPage = vi.fn()
  const useInfiniteSearchMovies = vi.fn().mockReturnValue({
    data: { pages: [{ docs: [], total: 0, page: 1, pages: 1 }] },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage,
  })
  return { useSearchMovies, useInfiniteSearchMovies }
})

const mocked = await vi.importMock<{
  useSearchMovies: ReturnType<typeof vi.fn>
  useInfiniteSearchMovies: ReturnType<typeof vi.fn>
}>('@/shared/hooks/useMovies')

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.getState().reset()
  })

  it('renders prompt without query', () => {
    render(
      <Providers>
        <SearchPage />
      </Providers>
    )
    expect(screen.getByText(/Поиск фильмов/i)).toBeInTheDocument()
  })

  it('applies filters from URL over store and maps to API params', () => {
    // URL: overrides store
    useSearchParamsMock.mockReturnValue(new URLSearchParams({ page: '2', genre: 'comedy', year: '2020', ratingFrom: '8' }))

    useAppStore.setState({
      searchQuery: 'matrix',
      searchFilters: { genre: 'drama', year: 2010, ratingFrom: 7 },
    })

    render(
      <Providers>
        <SearchPage />
      </Providers>
    )

    const lastCall = (mocked.useSearchMovies as unknown as Mock).mock.calls.at(-1)
    expect(lastCall).toBeTruthy()
    const [passedQuery, passedParams] = lastCall!
    expect(passedQuery).toBe('matrix')
    expect(passedParams).toMatchObject({
      page: 2,
      limit: 20,
      field: 'rating.kp',
      sortType: -1,
      ['genres.name']: 'comedy',
      year: '2020',
      ['rating.kp']: '8-10',
    })
  })

  it('triggers fetchNextPage via intersection when hasNextPage', async () => {
    // Reconfigure infinite hook for this case
    const fetchNextPage = vi.fn()
    ;(mocked.useInfiniteSearchMovies as unknown as Mock).mockReturnValue({
      data: { pages: [{ docs: [{ id: 1 }], total: 2, page: 1, pages: 2 }] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage,
    })

    useAppStore.setState({ searchQuery: 'test' })

    render(
      <Providers>
        <SearchPage />
      </Providers>
    )

    // Ждём таска макроочереди от mock useIntersectionObserver
    await new Promise((r) => setTimeout(r, 0))
    expect(fetchNextPage).toHaveBeenCalled()
  })
})


