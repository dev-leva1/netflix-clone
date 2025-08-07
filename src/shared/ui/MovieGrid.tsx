import { useCallback } from 'react'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { MovieCard } from './MovieCard'
import type { Movie } from '@/shared/types'
import { createGridVariants, createAppearCardVariants } from '@/shared/ui/motion'

interface MovieGridProps {
  movies: Movie[]
  title?: string
  loading?: boolean
  error?: string | undefined
  emptyMessage?: string
  cardSize?: 'small' | 'medium' | 'large'
  showRating?: boolean
  showFavoriteButton?: boolean
  columns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  sentinel?: React.RefObject<HTMLDivElement>
}

const Container = styled.div`
  width: 100%;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
  padding: 0 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    font-size: 20px;
    margin-bottom: 16px;
    padding: 0 16px;
  }
`

const Grid = styled(motion.div)<{ columns: { mobile: number; tablet: number; desktop: number } }>`
  display: grid;
  gap: 20px;
  padding: 0 20px;
  
  grid-template-columns: repeat(${props => props.columns.mobile}, 1fr);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: repeat(${props => props.columns.tablet}, 1fr);
    gap: 24px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(${props => props.columns.desktop}, 1fr);
    gap: 32px;
    padding: 0 32px;
  }
`

const LoadingGrid = styled.div<{ columns: { mobile: number; tablet: number; desktop: number } }>`
  display: grid;
  gap: 20px;
  padding: 0 20px;
  
  grid-template-columns: repeat(${props => props.columns.mobile}, 1fr);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: repeat(${props => props.columns.tablet}, 1fr);
    gap: 24px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(${props => props.columns.desktop}, 1fr);
    gap: 32px;
    padding: 0 32px;
  }
`

const SkeletonCard = styled(motion.div)<{ size: 'small' | 'medium' | 'large' }>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 0%,
    rgba(255, 255, 255, 0.1) 50%,
    ${({ theme }) => theme.colors.surface} 100%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          width: 160px;
          height: 240px;
        `
      case 'large':
        return `
          width: 280px;
          height: 420px;
        `
      default:
        return `
          width: 200px;
          height: 300px;
        `
    }
  }}
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  grid-column: 1 / -1;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
  margin: 0;
  max-width: 400px;
`

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  grid-column: 1 / -1;
`

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.error};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 16px;
  margin: 0;
  max-width: 400px;
`

const reduced = typeof window !== 'undefined' && 'matchMedia' in window
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false
const gridVariants = createGridVariants(reduced)
const cardVariants = createAppearCardVariants(reduced)

const skeletonVariants = {
  loading: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 1.5,
      ease: "linear" as const,
      repeat: Infinity
    }
  }
}

export const MovieGrid = ({
  movies,
  title,
  loading = false,
  error,
  emptyMessage = "Фильмы не найдены",
  cardSize = 'medium',
  showRating = true,
  showFavoriteButton = true,
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 5
  },
  sentinel
}: MovieGridProps) => {
  const navigate = useNavigate()

  const handleMovieClick = useCallback((movie: Movie) => {
    navigate(`/movie/${movie.id}`)
  }, [navigate])

  const renderSkeletons = () => {
    const skeletonCount = columns.desktop
    return Array.from({ length: skeletonCount }, (_, index) => (
      <SkeletonCard
        key={`skeleton-${index}`}
        size={cardSize}
        variants={skeletonVariants}
        animate="loading"
      />
    ))
  }

  if (error) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <LoadingGrid columns={columns}>
          <ErrorState>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorMessage>{error}</ErrorMessage>
          </ErrorState>
        </LoadingGrid>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <LoadingGrid columns={columns}>
          {renderSkeletons()}
        </LoadingGrid>
      </Container>
    )
  }

  if (!movies.length) {
    return (
      <Container>
        {title && <Title>{title}</Title>}
        <LoadingGrid columns={columns}>
          <EmptyState>
            <EmptyIcon>🎬</EmptyIcon>
            <EmptyMessage>{emptyMessage}</EmptyMessage>
          </EmptyState>
        </LoadingGrid>
      </Container>
    )
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <Grid
        columns={columns}
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={cardVariants}>
            <MovieCard
              movie={movie}
              size={cardSize}
              showRating={showRating}
              showFavoriteButton={showFavoriteButton}
              onClick={handleMovieClick}
            />
          </motion.div>
        ))}
      </Grid>
      {sentinel && <div ref={sentinel} />}
    </Container>
  )
} 