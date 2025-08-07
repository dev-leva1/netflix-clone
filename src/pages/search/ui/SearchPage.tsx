import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useAppStore } from '@/shared/lib/store'
import { useInfiniteSearchMovies, useSearchMovies } from '@/shared/hooks/useMovies'
import { MovieGrid } from '@/shared/ui'
import { useSearchParams } from 'react-router-dom'
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import { SearchFilters } from './Filters'

const SearchContainer = styled.div`
  padding: 2rem;
`

const SearchTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  margin-bottom: 2rem;
`

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 2rem;
`

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: 2rem;
`

const NoResults = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 2rem;
`

export const SearchPage = () => {
  const [params] = useSearchParams()
  const searchQuery = useAppStore(state => state.searchQuery)
  const filters = useAppStore(state => state.searchFilters)

  const moviesParams = useMemo(() => {
    const page = Number(params.get('page') || '1')
    const genre = params.get('genre') || filters.genre || undefined
    const year = params.get('year') || (filters.year?.toString() ?? undefined)
    const ratingFrom = params.get('ratingFrom') || (filters.ratingFrom?.toString() ?? undefined)

    const p: Partial<import('@/shared/api/movies').MoviesQueryParams> = {
      page,
      limit: 20,
      field: 'rating.kp',
      sortType: -1,
    }
    if (genre !== undefined) p['genres.name'] = genre
    if (year !== undefined) p.year = year
    if (ratingFrom !== undefined) p['rating.kp'] = `${ratingFrom}-10`
    return p as import('@/shared/api/movies').MoviesQueryParams
  }, [params, filters])

  const { data, isLoading, error } = useSearchMovies(searchQuery, moviesParams)

  const infinite = useInfiniteSearchMovies(searchQuery, { ...moviesParams })
  const { targetRef } = useIntersectionObserver(() => {
    if (infinite.hasNextPage && !infinite.isFetchingNextPage) {
      infinite.fetchNextPage()
    }
  }, { rootMargin: '800px' })

  return (
    <SearchContainer>
      <SearchTitle>
        {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Поиск фильмов'}
      </SearchTitle>
      <SearchFilters />
      
      {!searchQuery && <NoResults>Введите запрос для поиска фильмов</NoResults>}
      {searchQuery && isLoading && <LoadingText>Поиск...</LoadingText>}
      {searchQuery && error && <ErrorText>Ошибка поиска: {error.message}</ErrorText>}
      {searchQuery && data && data.docs.length === 0 && (
        <NoResults>По запросу "{searchQuery}" ничего не найдено</NoResults>
      )}
      {searchQuery && data && data.docs.length > 0 && (
        <MovieGrid
          title={`Результаты: ${data.total}`}
          movies={(infinite.data?.pages.flatMap((p) => p.docs) || data.docs)}
          loading={isLoading || infinite.isFetchingNextPage}
          error={error?.message}
          emptyMessage={`По запросу "${searchQuery}" ничего не найдено`}
          cardSize="medium"
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />
      )}
      <div ref={targetRef} style={{ height: 1 }} />
    </SearchContainer>
  )
} 