import React from 'react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Providers } from '@/app/providers'
import { MoviePage } from './MoviePage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  }
})

vi.mock('react-player', () => ({
  default: () => React.createElement('div', { 'data-testid': 'react-player' }),
}))

vi.mock('@/shared/hooks/useMovies', () => {
  return {
    useMovie: vi.fn(),
    useInfiniteSimilarMovies: vi.fn(),
    movieKeys: {},
  }
})

const mockedHooks = await vi.importMock<typeof import('@/shared/hooks/useMovies')>('@/shared/hooks/useMovies')

describe('MoviePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(mockedHooks.useInfiniteSimilarMovies as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    })
  })

  it('renders loading state', () => {
    ;(mockedHooks.useMovie as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    })

    render(
      <Providers>
        <MoviePage />
      </Providers>
    )

    expect(screen.getByText(/Загрузка фильма/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    ;(mockedHooks.useMovie as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Ошибка' },
    })

    render(
      <Providers>
        <MoviePage />
      </Providers>
    )

    expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument()
  })

  it('renders movie details on success', () => {
    ;(mockedHooks.useMovie as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        name: 'Test Movie',
        year: 2020,
        rating: { kp: 7.5 },
        poster: { url: '' },
        genres: [{ name: 'драма' }],
        countries: [{ name: 'США' }],
      },
      isLoading: false,
      error: undefined,
    })

    render(
      <Providers>
        <MoviePage />
      </Providers>
    )

    expect(screen.getByRole('heading', { name: /Test Movie/i })).toBeInTheDocument()
    expect(screen.getByText(/2020/)).toBeInTheDocument()
  })
})


