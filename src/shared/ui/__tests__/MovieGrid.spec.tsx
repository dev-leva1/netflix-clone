import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { config } from '@/shared/config'
import { MovieGrid } from '@/shared/ui/MovieGrid'

const theme = {
  colors: config.ui.colors,
  breakpoints: config.ui.breakpoints,
  transitions: config.ui.transitions,
  borderRadius: config.ui.borderRadius,
  shadows: config.ui.shadows,
}

describe('MovieGrid', () => {
  it('shows empty state when no movies', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MovieGrid movies={[]} title="Тест" />
        </ThemeProvider>
      </BrowserRouter>
    )
    expect(screen.getByText('Тест')).toBeInTheDocument()
    expect(screen.getByText('Фильмы не найдены')).toBeInTheDocument()
  })
})


