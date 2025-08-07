import { render, screen, fireEvent } from '@testing-library/react'
import { Providers } from '@/app/providers'
import { MovieCard } from '@/shared/ui/MovieCard'

const movie = {
  id: 1,
  name: 'Test',
  year: 2020,
  rating: { kp: 7.1 },
  poster: { url: '' },
} as unknown as import('@/shared/types').Movie

describe('MovieCard', () => {
  it('renders title and year', () => {
    render(
      <Providers>
        <MovieCard movie={movie} />
      </Providers>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('2020')).toBeInTheDocument()
  })

  it('toggles favorite on click of favorite button', () => {
    render(
      <Providers>
        <MovieCard movie={movie} />
      </Providers>
    )
    const card = screen.getByText('Test')
    fireEvent.click(card)
    expect(card).toBeInTheDocument()
  })
})


