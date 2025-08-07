import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { lazy, Suspense } from 'react'

const MoviePage = lazy(() => import('@/pages/movie').then(m => ({ default: m.MoviePage })))
const SearchPage = lazy(() => import('@/pages/search').then(m => ({ default: m.SearchPage })))
const FavoritesPage = lazy(() => import('@/pages/favorites').then(m => ({ default: m.FavoritesPage })))
const NotFoundPage = lazy(() => import('@/pages/not-found').then(m => ({ default: m.NotFoundPage })))

export const AppRouter = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}