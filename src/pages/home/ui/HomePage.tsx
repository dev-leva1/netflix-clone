import styled from '@emotion/styled'
import { useTrendingMovies, useNewMovies, useTopMovies } from '@/shared/hooks/useMovies'

const HomeContainer = styled.div`
  padding: 2rem;
`

const Section = styled.section`
  margin-bottom: 3rem;
`

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`

const MovieCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  transition: transform ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`

const MoviePoster = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`

const MovieInfo = styled.div`
  padding: 1rem;
`

const MovieTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const MovieRating = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
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

export const HomePage = () => {
  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useTrendingMovies()
  const { data: newData, isLoading: newLoading, error: newError } = useNewMovies()
  const { data: topData, isLoading: topLoading, error: topError } = useTopMovies()

  const renderMovieSection = (
    title: string,
    data: any,
    isLoading: boolean,
    error: any
  ) => (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      {isLoading && <LoadingText>Загрузка...</LoadingText>}
      {error && <ErrorText>Ошибка загрузки: {error.message}</ErrorText>}
      {data?.docs && (
        <MovieGrid>
          {data.docs.slice(0, 10).map((movie: any) => (
            <MovieCard key={movie.id}>
              {movie.poster?.url && (
                <MoviePoster
                  src={movie.poster.url}
                  alt={movie.name || movie.alternativeName}
                />
              )}
              <MovieInfo>
                <MovieTitle>{movie.name || movie.alternativeName}</MovieTitle>
                {movie.rating?.kp && (
                  <MovieRating>⭐ {movie.rating.kp.toFixed(1)}</MovieRating>
                )}
              </MovieInfo>
            </MovieCard>
          ))}
        </MovieGrid>
      )}
    </Section>
  )

  return (
    <HomeContainer>
      {renderMovieSection('Трендовые фильмы', trendingData, trendingLoading, trendingError)}
      {renderMovieSection('Новинки', newData, newLoading, newError)}
      {renderMovieSection('Топ фильмы', topData, topLoading, topError)}
    </HomeContainer>
  )
} 