import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import { useMovie } from '@/shared/hooks/useMovies'

const MovieContainer = styled.div`
  padding: 2rem;
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

const MovieTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 2rem;
  margin-bottom: 1rem;
`

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>()
  const movieId = id ? parseInt(id, 10) : 0
  const { data: movie, isLoading, error } = useMovie(movieId, Boolean(movieId))

  if (isLoading) return <LoadingText>Загрузка фильма...</LoadingText>
  if (error) return <ErrorText>Ошибка загрузки: {error.message}</ErrorText>
  if (!movie) return <ErrorText>Фильм не найден</ErrorText>

  return (
    <MovieContainer>
      <MovieTitle>{movie.name || movie.alternativeName}</MovieTitle>
      <p>Страница фильма в разработке...</p>
    </MovieContainer>
  )
} 