import styled from '@emotion/styled'
import { useCallback, useMemo } from 'react'
import { useAppStore } from '@/shared/lib/store'
import { useSearchParams } from 'react-router-dom'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`

const Select = styled.select`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
`

const genres = [
  '',
  'драма',
  'комедия',
  'боевик',
  'фантастика',
  'триллер',
  'ужасы',
  'приключения',
  'мультфильм',
]

const years = Array.from({ length: 60 }, (_, i) => `${new Date().getFullYear() - i}`)
const ratings = ['', '9', '8', '7', '6']

export const SearchFilters = () => {
  const [params, setParams] = useSearchParams()
  const { setSearchFilters } = useAppStore()

  const current = useMemo(() => ({
    genre: params.get('genre') || '',
    year: params.get('year') || '',
    ratingFrom: params.get('ratingFrom') || '',
  }), [params])

  const update = useCallback((key: 'genre' | 'year' | 'ratingFrom', value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
    if (key === 'ratingFrom') {
      setSearchFilters({ ratingFrom: value ? Number(value) : undefined })
    } else if (key === 'year') {
      setSearchFilters({ year: value || undefined })
    } else {
      setSearchFilters({ genre: value || undefined })
    }
  }, [params, setParams, setSearchFilters])

  return (
    <Container>
      <Select value={current.genre} onChange={(e) => update('genre', e.target.value)}>
        {genres.map((g) => (
          <option key={g} value={g}>{g ? g : 'Жанр'}</option>
        ))}
      </Select>
      <Select value={current.year} onChange={(e) => update('year', e.target.value)}>
        <option value="">Год</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </Select>
      <Select value={current.ratingFrom} onChange={(e) => update('ratingFrom', e.target.value)}>
        <option value="">Рейтинг от</option>
        {ratings.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </Select>
    </Container>
  )
}


