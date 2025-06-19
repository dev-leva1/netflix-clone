import styled from '@emotion/styled'
import { useAppStore } from '@/shared/lib/store'
import { useSearchMovies } from '@/shared/hooks/useMovies'

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
  const searchQuery = useAppStore(state => state.searchQuery)
  const { data, isLoading, error } = useSearchMovies(searchQuery)

  return (
    <SearchContainer>
      <SearchTitle>
        {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Поиск фильмов'}
      </SearchTitle>
      
      {!searchQuery && <NoResults>Введите запрос для поиска фильмов</NoResults>}
      {searchQuery && isLoading && <LoadingText>Поиск...</LoadingText>}
      {searchQuery && error && <ErrorText>Ошибка поиска: {error.message}</ErrorText>}
      {searchQuery && data && data.docs.length === 0 && (
        <NoResults>По запросу "{searchQuery}" ничего не найдено</NoResults>
      )}
      {searchQuery && data && data.docs.length > 0 && (
        <div>Найдено {data.docs.length} результатов</div>
      )}
    </SearchContainer>
  )
} 