import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { MoviePage } from '@/pages/movie'
import { SearchPage } from '@/pages/search'
import { FavoritesPage } from '@/pages/favorites'
import { NotFoundPage } from '@/pages/not-found'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
} 