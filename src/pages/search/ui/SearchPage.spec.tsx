import { render, screen } from '@testing-library/react'
import { Providers } from '@/app/providers'
import { SearchPage } from './SearchPage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams({ q: 'test' })],
  }
})

describe('SearchPage', () => {
  it('renders prompt without query', () => {
    render(
      <Providers>
        <SearchPage />
      </Providers>
    )
    expect(screen.getByText(/Поиск фильмов/i)).toBeInTheDocument()
  })
})


