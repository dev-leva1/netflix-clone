import styled from '@emotion/styled'
import { useEffect, useMemo, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMovie, useInfiniteSimilarMovies } from '@/shared/hooks/useMovies'
import { MovieGrid } from '@/shared/ui/MovieGrid'
import type { ApiResponse, Movie } from '@/shared/types'
import { setSeo } from '@/shared/lib/seo'
// type import removed (unused)

const ReactPlayer = lazy(() => import('react-player'))

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
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

const Hero = styled.div<{ background?: string | undefined }>`
  position: relative;
  width: 100%;
  min-height: 360px;
  background: ${({ background }) =>
    background ? `url(${background}) center/cover no-repeat` : '#111'};
  display: flex;
  align-items: flex-end;
  box-shadow: inset 0 -120px 120px rgba(0,0,0,0.8);
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px;
  max-width: 1200px;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 40px;
  font-weight: 800;
  margin: 0 0 8px 0;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 12px;
`

const Section = styled.div`
  max-width: 1200px;
  padding: 0 24px 24px 24px;
  margin-top: -40px;
`

const SectionTitle = styled.h2`
  font-size: 24px;
  margin: 16px 0;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: pre-wrap;
`

const PersonsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  margin-top: 8px;
`

const PersonItem = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: 8px;
  margin-top: 12px;
`

const TrailerWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
`

const ProvidersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`

const ProviderLink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 13px;
  text-decoration: none;
`

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>()
  const movieId = id ? parseInt(id, 10) : NaN
  const isValidId = Number.isFinite(movieId) && movieId > 0

  const { data: movie, isLoading, error } = useMovie(isValidId ? (movieId as number) : 0, isValidId)
  const infiniteSimilar = useInfiniteSimilarMovies(isValidId ? (movieId as number) : 0, { limit: 12 })

  const similarMovies = useMemo(() => {
    const pages = (infiniteSimilar.data?.pages ?? []) as Array<ApiResponse<Movie>>
    const docs = pages.flatMap((p) => p.docs ?? [])
    const seen = new Set<number>()
    return docs.filter((m) => {
      if (!m || typeof m.id !== 'number') return false
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
  }, [infiniteSimilar.data])

  const title = movie?.name || movie?.alternativeName || 'Без названия'
  const safeTrailerUrl = useMemo(() => selectSafeTrailerUrl(movie), [movie])
  const metaPieces = useMemo(() => {
    if (!movie) return [] as string[]
    const year = movie.year ? String(movie.year) : undefined
    const length = movie.movieLength ? `${movie.movieLength} мин` : undefined
    const age = movie.ageRating ? `${movie.ageRating}+` : undefined
    const rating = movie.rating?.kp ? `⭐ ${movie.rating.kp.toFixed(1)} KP` : undefined
    return [year, length, age, rating].filter(Boolean) as string[]
  }, [movie])

  useEffect(() => {
    if (!movie) return
    const site = 'Netflix Clone'
    const description = movie.description || movie.shortDescription || `${title}${metaPieces.length ? ` — ${metaPieces.join(' · ')}` : ''}`
    setSeo(`${title} — ${site}`, description)
  }, [movie, title, metaPieces])

  if (!isValidId) return <ErrorText role="alert" aria-live="assertive">Страница не найдена</ErrorText>
  if (isLoading) return <LoadingText role="status" aria-live="polite">Загрузка фильма...</LoadingText>
  if (error) return <ErrorText role="alert" aria-live="assertive">Ошибка загрузки: {error.message}</ErrorText>
  if (!movie) return <ErrorText>Фильм не найден</ErrorText>

  const heroBg = movie.backdrop?.url || movie.poster?.url
  return (
    <Page>
      <Hero as={motion.section} {...(heroBg ? { background: heroBg } : {})}>
        <HeroContent>
          <Title>{title}</Title>
          <Meta>
            {metaPieces.map((piece) => (
              <Badge key={piece}>{piece}</Badge>
            ))}
            {movie.genres?.length ? (
              <Badge>{movie.genres.map((g) => g.name).slice(0, 3).join(' · ')}</Badge>
            ) : null}
            {movie.countries?.length ? (
              <Badge>{movie.countries.map((c) => c.name).slice(0, 2).join(' · ')}</Badge>
            ) : null}
          </Meta>
        </HeroContent>
      </Hero>

      <Section>
        {movie.slogan && <SectionTitle>Слоган</SectionTitle>}
        {movie.slogan && <Description>“{movie.slogan}”</Description>}

        <SectionTitle>Описание</SectionTitle>
        <Description>{movie.description || movie.shortDescription || 'Описание недоступно'}</Description>

        {safeTrailerUrl ? (
          <div>
            <SectionTitle>Трейлер</SectionTitle>
            <Suspense fallback={<TrailerWrapper />}> 
              <TrailerWrapper>
                <ReactPlayer
                  url={safeTrailerUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              </TrailerWrapper>
            </Suspense>
          </div>
        ) : (
          <div>
            <SectionTitle>Трейлер</SectionTitle>
            <Description>
              Трейлер недоступен из-за политики безопасности. Разрешены источники: YouTube и Vimeo.
            </Description>
            {movie.watchability?.items?.length ? (
              <div>
                <SectionTitle>Где смотреть</SectionTitle>
                <ProvidersList>
                  {movie.watchability.items.slice(0, 6).map((item) => (
                    item.url ? (
                      <ProviderLink key={item.name + item.url} href={item.url} target="_blank" rel="noreferrer noopener">
                        {item.name}
                      </ProviderLink>
                    ) : null
                  ))}
                </ProvidersList>
              </div>
            ) : null}
          </div>
        )}

        {!!movie.persons?.length && (
          <div>
            <SectionTitle>Создатели</SectionTitle>
            <PersonsList>
              {(() => {
                const filtered = (movie.persons || []).filter(
                  (p) => p.enProfession === 'director' || p.enProfession === 'writer'
                )
                const seen = new Set<number>()
                return filtered
                  .filter((p) => {
                    if (seen.has(p.id)) return false
                    seen.add(p.id)
                    return true
                  })
                  .slice(0, 8)
                  .map((p) => (
                    <PersonItem key={`${p.id}`}>{p.name || p.enName || 'Без имени'}</PersonItem>
                  ))
              })()}
            </PersonsList>
          </div>
        )}

        {!!movie.persons?.length && (
          <div>
            <SectionTitle>В ролях</SectionTitle>
            <PersonsList>
              {(() => {
                const filtered = (movie.persons || []).filter((p) => p.enProfession === 'actor')
                const seen = new Set<number>()
                return filtered
                  .filter((p) => {
                    if (seen.has(p.id)) return false
                    seen.add(p.id)
                    return true
                  })
                  .slice(0, 12)
                  .map((p) => (
                    <PersonItem key={`${p.id}`}>{p.name || p.enName || 'Без имени'}</PersonItem>
                  ))
              })()}
            </PersonsList>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Похожие фильмы</SectionTitle>
        <MovieGrid
          movies={similarMovies}
          loading={infiniteSimilar.isLoading}
          error={undefined}
          cardSize="small"
          showFavoriteButton={false}
          columns={{ mobile: 2, tablet: 4, desktop: 6 }}
        />
        {infiniteSimilar.hasNextPage && (
          <Button onClick={() => infiniteSimilar.fetchNextPage()} disabled={infiniteSimilar.isFetchingNextPage}>
            {infiniteSimilar.isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
          </Button>
        )}
      </Section>
    </Page>
  )
} 

const ALLOWED_VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com',
]

function isAllowedVideoUrl(urlStr?: string): boolean {
  if (!urlStr) return false
  try {
    const u = new URL(urlStr)
    return ALLOWED_VIDEO_HOSTS.some((host) => u.hostname === host || u.hostname.endsWith('.' + host))
  } catch {
    return false
  }
}

function selectSafeTrailerUrl(movie?: Movie): string | undefined {
  const url = movie?.videos?.trailers?.[0]?.url
  return isAllowedVideoUrl(url) ? url : undefined
}