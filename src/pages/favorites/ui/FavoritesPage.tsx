import styled from '@emotion/styled'
import { useAppStore } from '@/shared/lib/store'

const FavoritesContainer = styled.div`
  padding: 2rem;
`

const FavoritesTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  margin-bottom: 2rem;
`

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 2rem;
`

export const FavoritesPage = () => {
  const favorites = useAppStore(state => state.movies.favorites)

  return (
    <FavoritesContainer>
      <FavoritesTitle>Избранные фильмы</FavoritesTitle>
      
      {favorites.length === 0 ? (
        <EmptyState>
          У вас пока нет избранных фильмов
        </EmptyState>
      ) : (
        <div>Избранных фильмов: {favorites.length}</div>
      )}
    </FavoritesContainer>
  )
} 