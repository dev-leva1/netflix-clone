import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { useAppStore } from '@/shared/lib/store'
import type { Movie } from '@/shared/types'
import { createCardVariants, createOverlayVariants } from '@/shared/ui/motion'

interface MovieCardProps {
  movie: Movie
  size?: 'small' | 'medium' | 'large'
  showRating?: boolean
  showFavoriteButton?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
  onClick?: (movie: Movie) => void
}

const Card = styled(motion.div)<{ size: 'small' | 'medium' | 'large' }>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface};
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          width: 160px;
          height: 240px;
        `
      case 'large':
        return css`
          width: 280px;
          height: 420px;
        `
      default:
        return css`
          width: 200px;
          height: 300px;
        `
    }
  }}
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 75%;
  overflow: hidden;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
`

const InfoContainer = styled.div`
  padding: 12px;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const Year = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
  margin-top: 4px;
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`

const RatingValue = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 12px;
  font-weight: 600;
`

const StarIcon = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 12px;
`

const FavoriteButton = styled(motion.button)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  opacity: 0;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }
`

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 48px;
`

const reduced = typeof window !== 'undefined' && 'matchMedia' in window
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false
const cardVariants = createCardVariants(reduced)
const overlayVariants = createOverlayVariants()

const favoriteVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: { opacity: 1, scale: 1 },
  tap: { scale: 1.2 }
}

export const MovieCard = ({ 
  movie, 
  size = 'medium', 
  showRating = true, 
  showFavoriteButton = true,
  fetchPriority = 'auto',
  onClick 
}: MovieCardProps) => {
  const [imageError, setImageError] = useState(false)
  const favorites = useAppStore(state => state.movies.favorites)
  const toggleFavorite = useAppStore(state => state.toggleFavorite)
  
  const isFavorite = favorites.some((fav: Movie) => fav.id === movie.id)

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])



  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(movie)
  }, [movie, toggleFavorite])

  const handleCardClick = useCallback(() => {
    onClick?.(movie)
  }, [movie, onClick])

  const { width, height } = useMemo(() => {
    if (size === 'small') return { width: 160, height: 240 }
    if (size === 'large') return { width: 280, height: 420 }
    return { width: 200, height: 300 }
  }, [size])

  const renderImage = () => {
    if (imageError || !movie.poster?.url) {
      return (
        <PlaceholderImage>
          🎬
        </PlaceholderImage>
      )
    }

    const src = movie.poster.url
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    const avifSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif')

    return (
      <picture>
        <source srcSet={`${avifSrc}`} type="image/avif" />
        <source srcSet={`${webpSrc}`} type="image/webp" />
        <Image
          src={src}
          alt={movie.name || movie.alternativeName || 'Movie poster'}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          fetchPriority={fetchPriority}
          width={width}
          height={height}
          srcSet={`${src} 1x, ${src} 2x`}
        />
      </picture>
    )
  }

  return (
    <Card
      size={size}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={handleCardClick}
    >
      <ImageContainer aria-hidden>
        {renderImage()}
        
        <AnimatePresence>
          <Overlay
            variants={overlayVariants}
            initial="initial"
            whileHover="hover"
          >
            {showFavoriteButton && (
              <FavoriteButton
                variants={favoriteVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </FavoriteButton>
            )}
          </Overlay>
        </AnimatePresence>
      </ImageContainer>

      <InfoContainer>
        <div>
          <Title>{movie.name || movie.alternativeName || 'Без названия'}</Title>
          {movie.year && <Year>{movie.year}</Year>}
        </div>
        
        {showRating && movie.rating?.kp && (
          <Rating>
            <StarIcon>⭐</StarIcon>
            <RatingValue>{movie.rating.kp.toFixed(1)}</RatingValue>
          </Rating>
        )}
      </InfoContainer>
    </Card>
  )
} 