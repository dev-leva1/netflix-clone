import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import { useTrendingMovies, useNewMovies, useTopMovies } from '@/shared/hooks/useMovies'
import { MovieGrid } from '@/shared/ui'

const HomeContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding-top: 20px;
`

const Section = styled.section`
  margin-bottom: 48px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const HeroSection = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}20 0%,
    transparent 50%
  );
  padding: 60px 20px 40px;
  margin-bottom: 40px;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 80px 32px 60px;
  }
`

const HeroTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text.primary} 0%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    font-size: 32px;
  }
`

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 18px;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    font-size: 16px;
  }
`

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
}

const heroVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: "easeOut" as const
    }
  }
}

const sectionVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
}

export const HomePage = () => {
  const { 
    data: trendingData, 
    isLoading: trendingLoading, 
    error: trendingError 
  } = useTrendingMovies()
  
  const { 
    data: newData, 
    isLoading: newLoading, 
    error: newError 
  } = useNewMovies()
  
  const { 
    data: topData, 
    isLoading: topLoading, 
    error: topError 
  } = useTopMovies()

  return (
    <HomeContainer
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <HeroSection
        variants={heroVariants}
        initial="initial"
        animate="animate"
      >
        <HeroTitle>Netflix Clone</HeroTitle>
        <HeroSubtitle>
          Откройте для себя тысячи фильмов и сериалов. 
          Смотрите где угодно, когда угодно.
        </HeroSubtitle>
      </HeroSection>

      <motion.div variants={sectionVariants}>
        <Section>
          <MovieGrid
            title="🔥 Трендовые фильмы"
            movies={trendingData?.docs || []}
            loading={trendingLoading}
            error={trendingError?.message}
            emptyMessage="Не удалось загрузить трендовые фильмы"
            cardSize="medium"
            columns={{
              mobile: 2,
              tablet: 3,
              desktop: 5
            }}
          />
        </Section>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Section>
          <MovieGrid
            title="🆕 Новинки"
            movies={newData?.docs || []}
            loading={newLoading}
            error={newError?.message}
            emptyMessage="Не удалось загрузить новинки"
            cardSize="medium"
            columns={{
              mobile: 2,
              tablet: 3,
              desktop: 5
            }}
          />
        </Section>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <Section>
          <MovieGrid
            title="⭐ Топ фильмы"
            movies={topData?.docs || []}
            loading={topLoading}
            error={topError?.message}
            emptyMessage="Не удалось загрузить топ фильмы"
            cardSize="medium"
            columns={{
              mobile: 2,
              tablet: 3,
              desktop: 5
            }}
          />
        </Section>
      </motion.div>
    </HomeContainer>
  )
} 